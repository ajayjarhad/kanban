module.exports = async (__, args, cxt) => {
    try {
        const columns = await cxt.column.getColumns();
        return columns;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}