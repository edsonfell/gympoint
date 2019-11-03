import * as Yup from 'yup';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import HelpOrder from '../models/HelpOrder';

class StudentHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const result = await HelpOrder.findAll({
      where: { answer: null },
      order: ['created_at'],
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
      answer: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }
    const { id } = req.params;
    const { answer } = req.body;
    const answered_at = new Date();
    const order = await HelpOrder.findByPk(id);

    if (!order) {
      return res.status(400).send({ error: 'The help order not found' });
    }

    await order.update({
      id,
      answer,
      answered_at,
    });

    const result = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(HelpOrderAnswerMail.key, {
      result,
    });

    return res.json(result);
  }
}
export default new StudentHelpOrderController();
