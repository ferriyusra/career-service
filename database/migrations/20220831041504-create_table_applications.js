module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicants', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      job_id: {
        type: Sequelize.UUID,
      },
      first_name: {
        type: Sequelize.TEXT,
      },
      last_name: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      phone_number: {
        type: Sequelize.TEXT,
      },
      resume: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.TEXT,
        defaultValue: 'proses',
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('applicants');
  },
};
