'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reports = [
      {
        postId: 3,
        username: 'deki123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 3,
        username: 'dule123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 3,
        username: 'luka123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 3,
        username: 'meda123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 3,
        username: 'djuka123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 12,
        username: 'cico123',
        createdAt: new Date().toISOString().slice(0, 19)
      },
      {
        postId: 13,
        username: 'cico123',
        createdAt: new Date().toISOString().slice(0, 19)
      }
    ];

    const result = await queryInterface.bulkInsert('Reports', reports, {});

    for (const report of reports) {
      const result = await KieService.insertReportFact(report);
      if (result.status === ResultStatus.FAIL) {
        console.warn(`Failed to insert report fact for post ID ${report.postId}: ${result.message}`);
      }
    }

    return result;
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reports', null, {});
  }
};