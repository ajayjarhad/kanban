//This module is responsible for updating the position of the dragged card.
module.exports = async (__, args, cxt) => {
  try {
    const cardId = args.request.cardId;
    const pos = args.request.pos;
    const sectionId = args.request.sectionId;
    const card = await cxt.card.updatePos(cardId, pos, sectionId);

    return card;
  } catch (e) {
    console.log("Error => ", e);

    return null;
  }
};
