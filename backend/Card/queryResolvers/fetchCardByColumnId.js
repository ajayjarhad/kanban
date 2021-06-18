module.exports = async (__, args, cxt) => {
    try {
        const columnId = args.request.columnId;
        const cards = await cxt.card.getCardByColumnId(columnId);
        return cards;
    }
    catch (e) {
        console.log(e);
        return null
    }
}