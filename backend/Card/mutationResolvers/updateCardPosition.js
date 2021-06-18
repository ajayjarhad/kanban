module.exports = async (__, args, cxt) => {
    try {
        const cardId = args.request.cardId;
        const position = args.request.position;
        const columnId = args.request.columnId;
        const card = await cxt.card.updatePosition(cardId, position, columnId);
        return card;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}