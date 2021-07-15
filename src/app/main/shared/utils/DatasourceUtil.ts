import { IServerSideGetRowsRequest } from 'ag-grid-community';

export const updateSecondaryColumns = (request: IServerSideGetRowsRequest, result, gridOptions): void => {
    const valueCols = request.valueCols;
    if (request.pivotMode && request.pivotCols.length > 0) {
        const secondaryColDefs = createSecondaryColumns(result.secondaryColumnFields, valueCols);
        gridOptions.columnApi.setSecondaryColumns(secondaryColDefs);
    } else {
        gridOptions.columnApi.setSecondaryColumns([]);
    }
}

export const createSecondaryColumns = (fields, valueCols): any[] => {
    const secondaryCols = [];
    function addColDef(colId, parts, res): any[] {
        if (parts.length === 0) {
            return [];
        }

        const first = parts.shift();
        const existing = res.find(r => r.groupId === first);

        if (existing) {
            existing['children'] = addColDef(colId, parts, existing.children);
        } else {
            const colDef = {};
            const isGroup = parts.length > 0;
            if (isGroup) {
                colDef['groupId'] = first;
                colDef['headerName'] = first;
            } else {
                const valueCol = valueCols.find(r => r.field === first);
                colDef['colId'] = colId;
                colDef['headerName'] = valueCol.displayName;
                colDef['field'] = colId;
                colDef['type'] = 'measure';
            }

            const children = addColDef(colId, parts, []);
            if (children.length > 0) {
                colDef['children'] = children;
            }
            res.push(colDef);
        }
        return res;
    }

    fields.sort();
    fields.forEach(field => addColDef(field, field.split('_'), secondaryCols));
    return secondaryCols;
}