import * as fs from 'file-saver';
import { HowellExportModel } from './hw-export.model';

export class HowellCSV {

    constructor() {

    }
    static writeFile(filename: string, model: HowellExportModel) {
        let csv = new HowellCSV();
        return csv.writeFile(filename, model);
    }
    

    writeFile(filename: string, model: HowellExportModel) {
        let start = "\uFEFF";
        var content = model.title + '\n';
        content += model.headers.join(',') + '\n';
        for (let i = 0; i < model.datas.length; i++) {
            const column = model.datas[i];
            content += column.join(',') + '\n';
        }
        let blob = new Blob(
            [start + content],
            {
                type: "application/csv"
            });

        fs.saveAs(blob, filename + '.csv');

    };
}

