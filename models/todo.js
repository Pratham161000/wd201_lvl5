'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async Taskadding(params) {
      return await Todo.create(params);
    }
    static async Listshow() {
      console.log("My Todo list \n");

      console.log("Over due");

      const overdueItems = await Todo.dueover();
      console.log(
        overdueItems.map((item) => item.displayableString()).join("\n")
      );
      console.log("\n");

      console.log("Due Today");

      const dueItems = await Todo.Todaydue();
      console.log(dueItems.map((item) => item.displayableString()).join("\n"));
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await Todo.Laterdue();
      console.log(
        dueLaterItems.map((item) => item.displayableString()).join("\n")
      );
    }

    static async Laterdue() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async Todaydue() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueover() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
            completed: false
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      return Todo.update(
        { completed: true },
        {
          where: {
            id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};