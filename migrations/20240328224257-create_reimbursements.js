'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const DataTypes = Sequelize;
    return queryInterface.createTable('reimbursements', {
      reimbursement_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      service_provider_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      cycle_start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cycle_end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_activity_value: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      reimbursed_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'processed'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      processed_at: {
        type: DataTypes.DATE,
        allowNull: true,
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
