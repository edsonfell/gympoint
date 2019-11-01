import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { student_id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id },
      order: ['created_at'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['student_id', ['created_at', 'checkin_date']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(checkins);
  }

  async store(req, res) {
    // We consider a limit of 5 checkins for each 7 days
    const actualDate = new Date();
    const { student_id } = req.params;

    const studentExist = await Student.findByPk(student_id);

    if (!studentExist) {
      return res.status(400).send({ error: 'Student not found' });
    }

    const checkinsCount = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [subDays(actualDate, 7), actualDate],
        },
      },
    });
    if (checkinsCount.length === 5) {
      return res.status(400).send({ error: 'Checking limit reached' });
    }

    const checkin = await Checkin.create({ student_id });
    return res.json(checkin);
  }
}
export default new CheckinController();
