$(function () {
    let values = [];
    let root;
    let getSummary = function (node) {
        let result = [0, 0];
        if (node.hasChildren) {
            node.children.forEach(function (n) {
                result[0] = result[0] + 1; //count
                result[1] += n.data.Budget; //sum
                getSummary(n).forEach(function (item, index) {
                    result[index] += item;
                });
            });
        }
        if (result[0] > 0) {
            if (node.data) {
                values.push({
                    Department: node.data.Department + " Count = " + result[0],
                    Head_ID: node.data.ID,
                    Budget: result[1]
                });
            } else
                values.push({
                    Department: "Overall Count = " + result[0],
                    Head_ID: 0,
                    Budget: result[1]
                });
        }
        return result;
    };
    let treeList = $("#employees").dxTreeList({
        dataSource: {
            store: new DevExpress.data.ArrayStore({
                data: data
            }),
            reshapeOnPush: true
        },
        repaintChangesOnly: true,
        autoExpandAll: true,
        keyExpr: "ID",
        parentIdExpr: "Head_ID",
        onNodesInitialized: function (e) {
            if (e.component.isNotFirstLoad) return;
            root = e.root;

        },
        onContentReady: function (e) {
            if (e.component.isNotFirstLoad) return;
            e.component.isNotFirstLoad = true;
            getSummary(root);

            var store = treeList.getDataSource().store();
            store.load().done((items) => {
                let lastId = items[items.length - 1].ID + 1;
                console.log("lastId", lastId);

                let changes = [];
                for (let i = 0; i < values.length; i++) {

                    changes.push({
                        type: "insert",
                        data: {
                            ID: lastId,
                            Head_ID: values[i].Head_ID,
                            Department: values[i].Department,
                            Budget: values[i].Budget
                        }
                    });
                    lastId++;
                }
                store.push(changes);
            });
        },
        columns: [
            {
                dataField: "Department",
                cellTemplate: function (container, options) {
                    if (options.data.Department.includes("=")) {
                        let row = treeList.getRowElement(options.rowIndex);
                        row[0].style.backgroundColor = "#E8E8E8";
                    }
                    container.append($("<div>", { text: options.data.Department }));
                }
            },
            "Location",
            {
                dataField: "Budget",
                format: "currency"
            }
        ],
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true
    }).dxTreeList("instance");
});