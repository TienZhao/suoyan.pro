# Copyright (c) 2002-2018 "Neo Technology,"
# Network Engine for Objects in Lund AB [http://neotechnology.com]
# This file is a commercial add-on to Neo4j Enterprise Edition.


<#
.SYNOPSIS
Retrieves properties about a Neo4j installation

.DESCRIPTION
Retrieves properties about a Neo4j installation and outputs a Neo4j Server object.

.PARAMETER Neo4jHome
The full path to the Neo4j installation.

.EXAMPLE
Get-Neo4jServer -Neo4jHome 'C:\Neo4j'

Retrieves information about the Neo4j installation at C:\Neo4j

.EXAMPLE
'C:\Neo4j' | Get-Neo4jServer

Retrieves information about the Neo4j installation at C:\Neo4j

.EXAMPLE
Get-Neo4jServer

Retrieves information about the Neo4j installation as determined by Get-Neo4jHome

.OUTPUTS
System.Management.Automation.PSCustomObject
This is a Neo4j Server Object

.LINK
Get-Neo4jHome

.NOTES
This function is private to the powershell module

#>
function Get-Neo4jServer
{
  [CmdletBinding(SupportsShouldProcess = $false,ConfirmImpact = 'Low')]
  param(
    [Parameter(Mandatory = $false,ValueFromPipeline = $true)]
    [Alias('Home')]
    [AllowEmptyString()]
    [string]$Neo4jHome = ''
  )

  begin
  {
  }

  process
  {
    # Get and check the Neo4j Home directory
    if (($Neo4jHome -eq '') -or ($Neo4jHome -eq $null))
    {
      Write-Error "Could not detect the Neo4j Home directory"
      return
    }

    if (-not (Test-Path -Path $Neo4jHome))
    {
      Write-Error "$Neo4jHome does not exist"
      return
    }

    # Convert the path specified into an absolute path
    $Neo4jDir = Get-Item $Neo4jHome
    $Neo4jHome = $Neo4jDir.FullName.TrimEnd('\')

    $ConfDir = Get-Neo4jEnv 'NEO4J_CONF'
    if ($ConfDir -eq $null)
    {
      $ConfDir = (Join-Path -Path $Neo4jHome -ChildPath 'conf')
    }

    # Get the information about the server
    $serverProperties = @{
      'Home' = $Neo4jHome;
      'ConfDir' = $ConfDir;
      'LogDir' = (Join-Path -Path $Neo4jHome -ChildPath 'logs');
      'ServerVersion' = '';
      'ServerType' = 'Community';
      'DatabaseMode' = '';
    }

    # Check if the lib dir exists
    $libPath = (Join-Path -Path $Neo4jHome -ChildPath 'lib')
    if (-not (Test-Path -Path $libPath))
    {
      Write-Error "$Neo4jHome is not a valid Neo4j installation.  Missing $libPath"
      return
    }

    # Scan the lib dir...
    Get-ChildItem (Join-Path -Path $Neo4jHome -ChildPath 'lib') | Where-Object { $_.Name -like 'neo4j-server-*.jar' } | ForEach-Object -Process `
       {
      # if neo4j-server-enterprise-<version>.jar exists then this is the enterprise version
      if ($_.Name -like 'neo4j-server-enterprise-*.jar') { $serverProperties.ServerType = 'Enterprise' }

      # Get the server version from the name of the neo4j-server-<version>.jar file
      if ($matches -ne $null) { $matches.Clear() }
      if ($_.Name -match '^neo4j-server-(\d.+)\.jar$') { $serverProperties.ServerVersion = $matches[1] }
    }
    $serverObject = New-Object -TypeName PSCustomObject -Property $serverProperties

    # Validate the object
    if ([string]$serverObject.ServerVersion -eq '') {
      Write-Error "Unable to determine the version of the installation at $Neo4jHome"
      return
    }

    # Get additional settings...
    $setting = (Get-Neo4jSetting -ConfigurationFile 'neo4j.conf' -Name 'dbms.mode' -Neo4jServer $serverObject)
    if ($setting -ne $null) { $serverObject.DatabaseMode = $setting.value }

    # Set process level environment variables
    #  These should mirror the same paths in neo4j-shared.sh
    $dirSettings = @{ 'NEO4J_DATA' = @{ 'config_var' = 'dbms.directories.data'; 'default' = (Join-Path $Neo4jHome 'data') }
      'NEO4J_LIB' = @{ 'config_var' = 'dbms.directories.lib'; 'default' = (Join-Path $Neo4jHome 'lib') }
      'NEO4J_LOGS' = @{ 'config_var' = 'dbms.directories.logs'; 'default' = (Join-Path $Neo4jHome 'logs') }
      'NEO4J_PLUGINS' = @{ 'config_var' = 'dbms.directories.plugins'; 'default' = (Join-Path $Neo4jHome 'plugins') }
      'NEO4J_RUN' = @{ 'config_var' = 'dbms.directories.run'; 'default' = (Join-Path $Neo4jHome 'run') }
    }
    foreach ($name in $dirSettings.Keys)
    {
      $definition = $dirSettings[$name]
      $configured = (Get-Neo4jSetting -ConfigurationFile 'neo4j.conf' -Name $definition['config_var'] -Neo4jServer $serverObject)
      $value = $definition['default']
      if ($configured -ne $null) { $value = $configured.value }

      if ($value -ne $null) {
        if (-not (Test-Path $value -IsValid)) {
          throw "'$value' is not a valid path entry on this system."
        }

        $absolutePathRegex = '(^\\|^/|^[A-Za-z]:)'
        if (-not ($value -match $absolutePathRegex)) {
          $value = (Join-Path -Path $Neo4jHome -ChildPath $value)
        }
      }
      Set-Neo4jEnv $name $value
    }

    # Set log dir on server object and attempt to create it if it doesn't exist
    $serverObject.LogDir = (Get-Neo4jEnv 'NEO4J_LOGS')
    if ($serverObject.LogDir -ne $null) {
      if (-not (Test-Path -PathType Container -Path $serverObject.LogDir)) {
        New-Item -ItemType Directory -Force -ErrorAction SilentlyContinue -Path $serverObject.LogDir | Out-Null
      }
    }

    #  NEO4J_CONF and NEO4J_HOME are used by the Neo4j Admin Tool
    if ((Get-Neo4jEnv 'NEO4J_CONF') -eq $null) { Set-Neo4jEnv "NEO4J_CONF" $ConfDir }
    if ((Get-Neo4jEnv 'NEO4J_HOME') -eq $null) { Set-Neo4jEnv "NEO4J_HOME" $Neo4jHome }

    # Any deprecation warnings
    $WrapperPath = Join-Path -Path $ConfDir -ChildPath 'neo4j-wrapper.conf'
    if (Test-Path -Path $WrapperPath) { Write-Warning "$WrapperPath is deprecated and support for it will be removed in a future version of Neo4j; please move all your settings to neo4j.conf" }

    Write-Output $serverObject
  }

  end
  {
  }
}

# SIG # Begin signature block
# MIId2AYJKoZIhvcNAQcCoIIdyTCCHcUCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCDazIL49IIM9PDQ
# iEuVE4T77AHNAbe8ovVEHV5r5ByaN6CCGEcwggPFMIICraADAgECAgEAMA0GCSqG
# SIb3DQEBCwUAMIGDMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJpem9uYTETMBEG
# A1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20sIEluYy4xMTAv
# BgNVBAMTKEdvIERhZGR5IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IC0gRzIw
# HhcNMDkwOTAxMDAwMDAwWhcNMzcxMjMxMjM1OTU5WjCBgzELMAkGA1UEBhMCVVMx
# EDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxGjAYBgNVBAoT
# EUdvRGFkZHkuY29tLCBJbmMuMTEwLwYDVQQDEyhHbyBEYWRkeSBSb290IENlcnRp
# ZmljYXRlIEF1dGhvcml0eSAtIEcyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
# CgKCAQEAv3FiCPH6WTT3G8kYo/eASVjpIoMTpsUgQwE7hPHmhUmfJ+r2hBtOoLTb
# cJjHMgGxBT4HTu70+k8vWTAi56sZVmvigAf88xZ1gDlRe+X5NbZ0TqmNghPktj+p
# A4P6or6KFWp/3gvDthkUBcrqw6gElDtGfDIN8wBmIsiNaW02jBEYt9OyHGC0OPoC
# jM7T3UYH3go+6118yHz7sCtTpJJiaVElBWEaRIGMLKlDliPfrDqBmg4pxRyp6V0e
# tp6eMAo5zvGIgPtLXcwy7IViQyU0AlYnAZG0O3AqP26x6JyIAX2f1PnbU21gnb8s
# 51iruF9G/M7EGwM8CetJMVxpRrPgRwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/
# MA4GA1UdDwEB/wQEAwIBBjAdBgNVHQ4EFgQUOpqFBxBnKLbv9r0FQW4gwZTaD94w
# DQYJKoZIhvcNAQELBQADggEBAJnbXXnV+ZdZZwNh8X47BjF1LaEgjk9lh7T3ppy8
# 2Okv0Nta7s90jHO0OELaBXv4AnW4/aWx1672194Ty1MQfopG0Zf6ty4rEauQsCeA
# +eifWuk3n6vk32yzhRedPdkkT3mRNdZfBOuAg6uaAi21EPTYkMcEc0DtciWgqZ/s
# nqtoEplXxo8SOgmkvUT9BhU3wZvkMqPtOOjYZPMsfhT8Auqfzf8HaBfbIpA4LXqN
# 0VTxaeNfM8p6PXsK48p/Xznl4nW6xXYYM84s8C9Mrfex585PqMSbSlQGxX991QgP
# 4hz+fhe4rF721BayQwkMTfana7SZhGXKeoji4kS+XPfqHPUwggTQMIIDuKADAgEC
# AgEHMA0GCSqGSIb3DQEBCwUAMIGDMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJp
# em9uYTETMBEGA1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20s
# IEluYy4xMTAvBgNVBAMTKEdvIERhZGR5IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
# aXR5IC0gRzIwHhcNMTEwNTAzMDcwMDAwWhcNMzEwNTAzMDcwMDAwWjCBtDELMAkG
# A1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUx
# GjAYBgNVBAoTEUdvRGFkZHkuY29tLCBJbmMuMS0wKwYDVQQLEyRodHRwOi8vY2Vy
# dHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8xMzAxBgNVBAMTKkdvIERhZGR5IFNl
# Y3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBHMjCCASIwDQYJKoZIhvcNAQEB
# BQADggEPADCCAQoCggEBALngyxDUr3a91JNi6zBkuIEIbMME2WIXji//PmXPj85i
# 5jxSHNoWRUtVq3hrY4NikM4PaWyZyBoUi0zMRTPqiNyeo68r/oBhnXlXxM8u9D8w
# PF1H/JoWvMM3lkFRjhFLVPgovtCMvvAwOB7zsCb4Zkdjbd5xJkePOEdT0UYdtOPc
# AOpFrL28cdmqbwDb280wOnlPX0xH+B3vW8LEnWA7sbJDkdikM07qs9YnT60liqXG
# 9NXQpq50BWRXiLVEVdQtKjo++Li96TIKApRkxBY6UPFKrud5M68MIAd/6N8EOcJp
# AmxjUvp3wRvIdIfIuZMYUFQ1S2lOvDvTSS4f3MHSUvsCAwEAAaOCARowggEWMA8G
# A1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMB0GA1UdDgQWBBRAwr0njsw0
# gzCiM9f7bLPwtCyAzjAfBgNVHSMEGDAWgBQ6moUHEGcotu/2vQVBbiDBlNoP3jA0
# BggrBgEFBQcBAQQoMCYwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmdvZGFkZHku
# Y29tLzA1BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLmdvZGFkZHkuY29tL2dk
# cm9vdC1nMi5jcmwwRgYDVR0gBD8wPTA7BgRVHSAAMDMwMQYIKwYBBQUHAgEWJWh0
# dHBzOi8vY2VydHMuZ29kYWRkeS5jb20vcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQEL
# BQADggEBAAh+bJMQyDi4lqmQS/+hX08E72w+nIgGyVCPpnP3VzEbvrzkL9v4utNb
# 4LTn5nliDgyi12pjczG19ahIpDsILaJdkNe0fCVPEVYwxLZEnXssneVe5u8MYaq/
# 5Cob7oSeuIN9wUPORKcTcA2RH/TIE62DYNnYcqhzJB61rCIOyheJYlhEG6uJJQEA
# D83EG2LbUbTTD1Eqm/S8c/x2zjakzdnYLOqum/UqspDRTXUYij+KQZAjfVtL/qQD
# WJtGssNgYIP4fVBBzsKhkMO77wIv0hVU7kQV2Qqup4oz7bEtdjYm3ATrn/dhHxXc
# h2/uRpYoraEmfQoJpy4Eo428+LwEMAEwggUAMIID6KADAgECAgEHMA0GCSqGSIb3
# DQEBCwUAMIGPMQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJpem9uYTETMBEGA1UE
# BxMKU2NvdHRzZGFsZTElMCMGA1UEChMcU3RhcmZpZWxkIFRlY2hub2xvZ2llcywg
# SW5jLjEyMDAGA1UEAxMpU3RhcmZpZWxkIFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9y
# aXR5IC0gRzIwHhcNMTEwNTAzMDcwMDAwWhcNMzEwNTAzMDcwMDAwWjCBxjELMAkG
# A1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUx
# JTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMzAxBgNVBAsT
# Kmh0dHA6Ly9jZXJ0cy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5LzE0MDIG
# A1UEAxMrU3RhcmZpZWxkIFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgLSBH
# MjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOWQZkvs+UZxqSCDvuls
# v0rJSGmBdU5tJPbLFxP4sHFZhHprK4WkNLUW5cvM6UFwLKQu1voyfeGo3pQQrDHB
# wNhq/1knq3bW/At0a7inrj/EVPS0MUTdk1aMpExem4nLJIOb4ld9t9gSH8mFbfTR
# gPFQm4eu1AsQBfsnuihtF+kO1k25OVUG/wokBX4vxh1ybNSLKYxXfdrZ62Ya00+n
# 339SxDDFpckOAsVTv3c4aAYkw2bIN34wHkVxIzX/kNgqnY3nsJJNPH8qCpPczRZG
# ZfdghIt2S5EncxSS4OrujxbqjQ4+dhe/fYmAgERD5y3gQwl12jborduJOvVdEo4j
# BIMCAwEAAaOCASwwggEoMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEG
# MB0GA1UdDgQWBBQlRYFoUCY4PTstLL7Natm2PbNmYzAfBgNVHSMEGDAWgBR8DDIf
# p9kwf8R9aKNiqKHOqwdbJzA6BggrBgEFBQcBAQQuMCwwKgYIKwYBBQUHMAGGHmh0
# dHA6Ly9vY3NwLnN0YXJmaWVsZHRlY2guY29tLzA7BgNVHR8ENDAyMDCgLqAshipo
# dHRwOi8vY3JsLnN0YXJmaWVsZHRlY2guY29tL3Nmcm9vdC1nMi5jcmwwTAYDVR0g
# BEUwQzBBBgRVHSAAMDkwNwYIKwYBBQUHAgEWK2h0dHBzOi8vY2VydHMuc3RhcmZp
# ZWxkdGVjaC5jb20vcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQELBQADggEBAFZlyv7z
# Pwqok4sYx95DaRM0IL5OX3ioa5zbak1B28ET7NwxACJe9wCeDOA0ZTT5sTpOSMgS
# gYhcWz4IU3r3GmTfuFBhzFNRQClLwvSuOl/kyq0mzE5hQ+X9V6Y3cM5DK7CUw5Lp
# 4V+qEEm3aeTg0B9kpCvNH2+g+IQkGM55PamRv1QYE4mZVBENVcUmC3lPWhxu+WPb
# FICkB6v6sqW5iN2R/mU7pKN5volN4dCw9MgXDAqWFHwJt2zhwthV1BigqkFpcCSj
# ue/pWtw+65RK8LfeXw52+vv7aQNFQFDucgykEoaBzRPRTsQ8yk4N0ibxALe0pqLh
# bnqB/TCseh/HWXswggUhMIIECaADAgECAgkAhHYYKGL3whowDQYJKoZIhvcNAQEL
# BQAwgbQxCzAJBgNVBAYTAlVTMRAwDgYDVQQIEwdBcml6b25hMRMwEQYDVQQHEwpT
# Y290dHNkYWxlMRowGAYDVQQKExFHb0RhZGR5LmNvbSwgSW5jLjEtMCsGA1UECxMk
# aHR0cDovL2NlcnRzLmdvZGFkZHkuY29tL3JlcG9zaXRvcnkvMTMwMQYDVQQDEypH
# byBEYWRkeSBTZWN1cmUgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IC0gRzIwHhcNMTcx
# MTA3MTkzNzAzWhcNMjAxMTA3MTkzNzAzWjBiMQswCQYDVQQGEwJVUzETMBEGA1UE
# CBMKQ2FsaWZvcm5pYTESMBAGA1UEBxMJU2FuIE1hdGVvMRQwEgYDVQQKEwtOZW80
# aiwgSW5jLjEUMBIGA1UEAxMLTmVvNGosIEluYy4wggEiMA0GCSqGSIb3DQEBAQUA
# A4IBDwAwggEKAoIBAQDSoPiG1pU1Lvqo+aZsFTrUwaV1sDWVBtfWzSnDKB3bUJeC
# 7DhekXtt1FORi3PB4YAC/CSMGgwoBHuqgGuRaJbHjRlmYaZZdKVsgvmDwfEvv16j
# zoyUR8TMTTjCemIDAHwArEadkffpsgnFpQ6KG6+gag/39FXyM2rGmFaqSGkqjVRN
# u4zN5GQu8+CUvRuZO2zEuKdA4wv9ZlmWbV3bpCGIN3Zl4p39Fatz3KYNi4g8lFXh
# B8tJfBToRuqxLZpcuyrXG3PeLa6DNoYOJ3j49DJOEw8Wj9cnqvAaI3CNE2klZ7RS
# cE47YUh7rVpl/ykp9ohgZDtvhAA5RYI5KCnc+oXHAgMBAAGjggGFMIIBgTAMBgNV
# HRMBAf8EAjAAMBMGA1UdJQQMMAoGCCsGAQUFBwMDMA4GA1UdDwEB/wQEAwIHgDA1
# BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLmdvZGFkZHkuY29tL2dkaWcyczUt
# My5jcmwwXQYDVR0gBFYwVDBIBgtghkgBhv1tAQcXAjA5MDcGCCsGAQUFBwIBFito
# dHRwOi8vY2VydGlmaWNhdGVzLmdvZGFkZHkuY29tL3JlcG9zaXRvcnkvMAgGBmeB
# DAEEATB2BggrBgEFBQcBAQRqMGgwJAYIKwYBBQUHMAGGGGh0dHA6Ly9vY3NwLmdv
# ZGFkZHkuY29tLzBABggrBgEFBQcwAoY0aHR0cDovL2NlcnRpZmljYXRlcy5nb2Rh
# ZGR5LmNvbS9yZXBvc2l0b3J5L2dkaWcyLmNydDAfBgNVHSMEGDAWgBRAwr0njsw0
# gzCiM9f7bLPwtCyAzjAdBgNVHQ4EFgQUvj4gytCNJMDPx3lWv0klX6YK41IwDQYJ
# KoZIhvcNAQELBQADggEBABzaEnMJczETlZUdZE36x84eQS2AmumczZzTMbZ4IhJw
# xF8vVz2+Q+0BcR5uwAXa+s167yqIZsxAub3nu8GzYAF7D7wHDC1H1JNkgfnZf1w2
# WWGL6jkbr5RGrLlU2xE8o03iuFglU4QQl9ouXXBLAsLo/q+pMrPs+EO+g3DwXGFt
# jAKzkrMzJD5Ia2kVSC2aAXrffwRqMpbKVxkf0TQadMGLa6dVybYH7qBfDZ+u8P2K
# Y0qQyQYY63WoVk7TIq1VkbmRXtcvm3/plWPUNTPPEy0DfnjndA2UByib6/iqdnSZ
# 7MYit31rmSsRAS3Wil/qqOGlVfYrSm2s64ryPMOacAkwggV9MIIEZaADAgECAgkA
# hft3suFZEZcwDQYJKoZIhvcNAQELBQAwgcYxCzAJBgNVBAYTAlVTMRAwDgYDVQQI
# EwdBcml6b25hMRMwEQYDVQQHEwpTY290dHNkYWxlMSUwIwYDVQQKExxTdGFyZmll
# bGQgVGVjaG5vbG9naWVzLCBJbmMuMTMwMQYDVQQLEypodHRwOi8vY2VydHMuc3Rh
# cmZpZWxkdGVjaC5jb20vcmVwb3NpdG9yeS8xNDAyBgNVBAMTK1N0YXJmaWVsZCBT
# ZWN1cmUgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IC0gRzIwHhcNMTkwOTE3MDcwMDAw
# WhcNMjQwOTE3MDcwMDAwWjCBhzELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpv
# bmExEzARBgNVBAcTClNjb3R0c2RhbGUxJDAiBgNVBAoTG1N0YXJmaWVsZCBUZWNo
# bm9sb2dpZXMsIExMQzErMCkGA1UEAxMiU3RhcmZpZWxkIFRpbWVzdGFtcCBBdXRo
# b3JpdHkgLSBHMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK4xUTO5
# KWat61iuWRSC5ZZmabnSZI6Vtu0PpstcIj28n0OXPfK7z02vmXgEqTuJdMcJb1bN
# z12KeVox7CBtpFpbY4IovD7awY77EBJbrwThtzWk6EYJo5Z1IUzS9we0ZdwXpH5Y
# Xkfwv4eNKhgqbBpgnqs8vq6c7ZTMiAY8oh+F8wRPBnnb3oQe6PerXPpV8/Mi9/Vy
# 1cM0RDzk3nZmyYMT0SR8KeIcOe5qxbOQUCkSsVVfLriPseQDwSgFTXqTPWF4BQ4x
# 3n32IO4ke0d7x/M0PigRnZnGIPDNpEnwXCEUVxcCXxEQajDmhTdmZ7jTNkerqjjP
# 5M3/rE+liUYgTVUCAwEAAaOCAakwggGlMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/
# BAQDAgbAMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMIMB0GA1UdDgQWBBRnhH6XGXwC
# XC+V6/gJnDOS0i3ZrDAfBgNVHSMEGDAWgBQlRYFoUCY4PTstLL7Natm2PbNmYzCB
# hAYIKwYBBQUHAQEEeDB2MCoGCCsGAQUFBzABhh5odHRwOi8vb2NzcC5zdGFyZmll
# bGR0ZWNoLmNvbS8wSAYIKwYBBQUHMAKGPGh0dHA6Ly9jcmwuc3RhcmZpZWxkdGVj
# aC5jb20vcmVwb3NpdG9yeS9zZl9pc3N1aW5nX2NhLWcyLmNydDBUBgNVHR8ETTBL
# MEmgR6BFhkNodHRwOi8vY3JsLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkv
# bWFzdGVyc3RhcmZpZWxkMmlzc3VpbmcuY3JsMFAGA1UdIARJMEcwRQYLYIZIAYb9
# bgEHFwIwNjA0BggrBgEFBQcCARYoaHR0cDovL2NybC5zdGFyZmllbGR0ZWNoLmNv
# bS9yZXBvc2l0b3J5LzANBgkqhkiG9w0BAQsFAAOCAQEAgYxDPXocopQPzJmnA6Hl
# i348wi3xRL0bDHxwPdPdbLi/C9OZqUBg2IbEdSc9tatchgtjYENct1gGbOpd8QzN
# Wr1QBUrrkbf0ZbnZbqhXjATyDs8qZ6tDwrcLZkj/WJV21FO0G61mWnmnHwpHohhN
# nr7B8gpTtCC/AyO9mBYBx/AKjtqs0eTw4xVmC2Z5XOW5Vn+ftHjvRg7SH/6Uib/N
# ouFlknIrpYDfbQmbEHjJcEJhsn8MSdct1TwGztJhFthCLxYAT9T5xcsc8/PW/rEt
# JiFMVh2uJ0Ymg6vxA2rOsvNbMWFNa6rndTngtBIMiQ3oKvtf7QDXVFHfm2FITCyW
# MDGCBOcwggTjAgEBMIHCMIG0MQswCQYDVQQGEwJVUzEQMA4GA1UECBMHQXJpem9u
# YTETMBEGA1UEBxMKU2NvdHRzZGFsZTEaMBgGA1UEChMRR29EYWRkeS5jb20sIElu
# Yy4xLTArBgNVBAsTJGh0dHA6Ly9jZXJ0cy5nb2RhZGR5LmNvbS9yZXBvc2l0b3J5
# LzEzMDEGA1UEAxMqR28gRGFkZHkgU2VjdXJlIENlcnRpZmljYXRlIEF1dGhvcml0
# eSAtIEcyAgkAhHYYKGL3whowDQYJYIZIAWUDBAIBBQCggYQwGAYKKwYBBAGCNwIB
# DDEKMAigAoAAoQKAADAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIBBDAcBgorBgEE
# AYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQgPO7IPBg/KG2D
# 8lQw24BkJaTwPNR7qctrY/L+0qDGtsUwDQYJKoZIhvcNAQEBBQAEggEAs48psAZR
# KHSlrZehSmG4/X+RVxVRY5PJQMv9u7uBFbQb1oEwkkUr/e+ZNT+GC25egT59iwGm
# J/4X9TK7kzjqacO4qerZpBWs4ruLHaA3GiHexpe5EMeFtuw8AscJtdlmAkPYD0E+
# u38y2XForKy4nookE5M6JGXiUSUmNFL+w7nsmbO7BO6yDLN3OfiLoanacDsWTIza
# DFebGAnA57KETn6jeYn/fdbX7pVgxXY3bkUFAZp04RZu0r5l3w5Th43c5Qby6rI4
# ph+Y1ZpUMpJCfNJe57nv78+jJWbEdgmcUb8JmVKbbTwY5g9eCz5x03JDlK3Zgx07
# k0furL9dPjRm2aGCAm4wggJqBgkqhkiG9w0BCQYxggJbMIICVwIBATCB1DCBxjEL
# MAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2Rh
# bGUxJTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMzAxBgNV
# BAsTKmh0dHA6Ly9jZXJ0cy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5LzE0
# MDIGA1UEAxMrU3RhcmZpZWxkIFNlY3VyZSBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkg
# LSBHMgIJAIX7d7LhWRGXMAkGBSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZI
# hvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0yMDAzMjQxMDQ1MjlaMCMGCSqGSIb3DQEJ
# BDEWBBQt3pGU/FY005PRhhRdwTWYZ/vxNjANBgkqhkiG9w0BAQEFAASCAQBWJm3A
# NMdSxVkeWsOcGwcMZWdAZGJznR65cmTuXjgFlrGVu+J2z9KpkeM2rmRqUPxE2nFR
# Bp2pC404XoC7uH1zzfF4CEA5Xjj1XYr5Ma74I7b6WfM0A+1Q/jBd4nZ95Ix7jTC2
# 3zqPKCoOWKfbt9jrBAKGEz7vZVjMt4usJkEmEBKFgpuO4u3PlHLX3gW4K3YUVQVG
# s9Bt9f94ZZ/LBeUeF20dMNZg5EN+7DFoLoiVGpnS8VbpMOJqX3QIYcE5Ymqtnm0Z
# hx/VWrRKR1CexQOukzVaTD6qOSuCQmHu6IuvNbJbvUiTWS8xMQrl4oaRYgkeCrGy
# 6Ng6zNmjEBMjyAIe
# SIG # End signature block
