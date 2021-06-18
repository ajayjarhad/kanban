module.export = async (__, args, cxt) => {
    try {
        const cardInfo = {
            title: args.request.title,
            label: args.request.label,
            position: args.request.position,
            columnId: args.request.columnId,
        };
        const card = await cxt.card.insertCard(cardInfo);
        cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.CARD_ADDED, {
            cardAdded: card,
        });
        return card;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};