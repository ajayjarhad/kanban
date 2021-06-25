// Module responsible for Updateing chnages in section/column's position whenever it is dragged somewhere else from its original position
module.exports = async (__, args, cxt) => {
  try {
    const sectionId = args.request.sectionId;
    const pos = args.request.pos;

    const section = await cxt.section.updatePos(sectionId, pos);
    console.log("section", section);
    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.ON_SECTION_POS_CHANGE, {
      onSectionPosChange: section,
    });

    return section;
  } catch (e) {
    console.log("Error =>", e);
    return null;
  }
};
