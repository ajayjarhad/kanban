// This module is responsible for querying all the sections.
module.exports = async (__, args, cxt) => {
  try {
    const sections = await cxt.section.getSections();

    return sections;
  } catch (e) {
    console.log("Error => ", e);

    return null;
  }
};
