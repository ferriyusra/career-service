'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				primaryKey: true,
				type: Sequelize.INTEGER,
				autoIncrement: true,
			},
			name: {
				type: Sequelize.TEXT,
			},
			email: {
				type: Sequelize.TEXT,
			},
			image: {
				type: Sequelize.TEXT,
			},
			location: {
				type: Sequelize.TEXT,
			},
			password: {
				type: Sequelize.TEXT,
			},
			is_company: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			company_description: {
				type: Sequelize.TEXT,
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

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('users');
	},
};
