import * as Yup from 'yup';
import Student from '../models/Student';
// import Queue from '../../lib/Queue';
// import EnrollMail from '../jobs/EnrollMail';
import HelpOrder from '../models/HelpOrder';

class StudentHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { student_id } = req.params;
    const studentExist = await Student.findByPk(student_id);

    if (!studentExist) {
      return res.status(400).send({ error: 'Student not found' });
    }

    const result = await HelpOrder.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }
    const { student_id } = req.params;
    const { question } = req.body;
    const studentExist = await Student.findByPk(student_id);

    if (!studentExist) {
      return res.status(400).send({ error: 'Student not found' });
    }

    const result = await HelpOrder.create({
      student_id,
      question,
    });
    return res.json(result);
  }
}
export default new StudentHelpOrderController();
