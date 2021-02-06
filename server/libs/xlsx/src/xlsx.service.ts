import { Injectable } from '@nestjs/common';
import xlsx from 'node-xlsx';
// Or var xlsx = require('node-xlsx').default;

@Injectable()
export class XlsxService {

    testExportXlsx(){
        var xlsx = require("node-xlsx").default;
        const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
        var buffer =  xlsx.build([{name: "mySheetName", data: data}]);
        return buffer;
        // Exports buffer type
    }

    exportXlsx(data){
        var buffer =  xlsx.build([{name: "mySheetName", data: data}]);
        return buffer;
        // Exports buffer type
    }
}
