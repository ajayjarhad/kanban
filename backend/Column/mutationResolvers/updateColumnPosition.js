module.exports = async (__, args, cxt) => {
    try {
        const columnId = args.request.columnId;
        const position = args.request.position;
        const column = await cxt.column.updatePosition(columnId, position);
        console.log("column", column)
        cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.ON_COLUMN_POSITION_CHANGE, {
            onColumnnPositionChange: columnn,
        });
        return column;
    }
    catch(e) {
        console.log(e);
        return null;
    }
};