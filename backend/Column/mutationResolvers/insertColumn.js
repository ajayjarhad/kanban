module.exports = async (__, args, cxt) => {
    try {
        const columnInfo = {
            title: args.request.title,
            label: args.request.label,
            position: args.request.position,
        };
        const column = await cxt.column.insertColumn(columnInfo);
        cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.COLUMN_ADDED, {
            columnAdded: column,
        });
        return column;

    }
    catch (e) {
        console.log(e);
        return null
    }
    ;
};