const Mongoose = require("mongoose");

const columnSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true,
    },
    description: String,
    position: {
        type: Number,
        required: true,
    },
});

class Column {
    static getColumns() {
        return this.find().sort('position').exec();
    }
    static getColumnsByID(columnId) {
        return this.findOne({
            _id: Mongoose.mongo.ObjectID(columnId),
        }).exec();
    }
    static insertColumn(columnInfo) {
        const column = this(columnInfo);
        return column.save();
    }
    static updatePosition(columnId, position) {
        return this.findOneAndUpdate({
            _id: Mongoose.mongo.ObjectID(columnId),
        },
            {
                $set: {
                position,
            },
            },
            {
            new: true,
            },
        ).exec();
    }
}

columnSchema.loadClass(Column);
module.exports = Mongoose.model("Column", columnSchema)