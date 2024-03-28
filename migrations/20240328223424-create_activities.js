'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const DataTypes = Sequelize;
    return queryInterface.createTable('activities', {
      activity_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      reimbursement_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      activity_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      activity_type: {
        type: DataTypes.ENUM('activity', 'adjustment'),
        allowNull: false,
      },
      parent_activity_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
      },
      value: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
