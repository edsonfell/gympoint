import * as Yup from 'yup';
import {
  addMonths,
  parseISO,
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns';
import Enroll from '../models/Enroll';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import EnrollMail from '../jobs/EnrollMail';

class EnrollController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const enrolls = await Enroll.findAll({
      order: ['end_date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(enrolls);
  }

  async store(req, res) {
    // If we already have a plan for the student, it should be only updated
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }
    const studentExist = await Student.findByPk(req.body.student_id);

    if (!studentExist) {
      return res.status(400).send({ error: 'Student not found' });
    }

    const enrollExist = await Enroll.findOne({
      where: { student_id: req.body.student_id },
    });
    if (!enrollExist) {
      const { student_id, plan_id, start_date } = req.body;

      // The user can enroll an student to start using his plan today if wanted
      // We only check if the start date is not before today
      const nowDate = setSeconds(setMinutes(setHours(new Date(), 0), 0), -1);

      if (isBefore(parseISO(start_date), nowDate)) {
        return res
          .status(400)
          .send({ error: "The start date can't be before today!" });
      }

      const planExist = await Plan.findByPk(plan_id);
      if (!planExist) {
        return res.status(400).send({ error: 'Invalid plan ID' });
      }
      const { duration, price } = planExist;
      const totalPrice = price * duration;
      const end_date = addMonths(parseISO(start_date), duration);
      const { id } = await Enroll.create({
        student_id,
        plan_id,
        price: totalPrice,
        start_date: parseISO(start_date),
        end_date,
      });
      const result = await Enroll.findByPk(id, {
        include: [
          {
            model: Plan,
            as: 'plan',
            attributes: ['title'],
          },
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email'],
          },
        ],
      });
      await Queue.add(EnrollMail.key, {
        result,
      });

      return res.json(result);
    }
    return res
      .status(400)
      .send({ error: 'There is already a enroll for this user' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }
    const { student_id } = req.params;

    const enrollExist = await Enroll.findOne({
      where: { student_id },
    });
    if (!enrollExist) {
      return res.status(400).send({ error: 'Enroll not found for this user' });
    }

    const { plan_id, start_date } = req.body;

    // The user can enroll an student to start using his plan today if wanted
    // We only check if the start date is not before today
    const nowDate = setSeconds(setMinutes(setHours(new Date(), 0), 0), -1);

    if (isBefore(parseISO(start_date), nowDate)) {
      return res
        .status(400)
        .send({ error: "The start date can't be before today!" });
    }

    const planExist = await Plan.findByPk(plan_id);
    if (!planExist) {
      return res.status(400).send({ error: 'Invalid plan ID' });
    }
    const { duration, price } = planExist;
    const totalPrice = price * duration;
    const end_date = addMonths(parseISO(start_date), duration);
    const updatedEnroll = await Enroll.update(
      {
        plan_id,
        price: totalPrice,
        start_date: parseISO(start_date),
        end_date,
      },
      {
        where: { student_id },
        returning: true,
        plain: true,
      }
    );

    const result = await Enroll.findByPk(updatedEnroll[1].id, {
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(EnrollMail.key, {
      result,
    });

    return res.json(result);
  }

  async delete(req, res) {
    try {
      await Enroll.destroy({ where: { id: req.params.id } });
      return res.status(200).send({
        error: 'The enroll was deleted',
      });
    } catch (error) {
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  }
}
export default new EnrollController();
