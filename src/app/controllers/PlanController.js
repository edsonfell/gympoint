import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }

    const planExist = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (!planExist) {
      const { id, title, duration, price } = await Plan.create(req.body);
      return res.json({
        id,
        title,
        duration,
        price,
      });
    }
    return res
      .status(400)
      .send({ error: 'There is already a plan with the same tile' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).send({ error: 'Plan not found' });
    }

    const titleCheck = req.body.title;

    // Checking if we already have a plan with the same title
    if (titleCheck != null && titleCheck !== plan.title) {
      const planExist = await Plan.findOne({
        where: { title: req.body.title },
      });
      if (planExist) {
        return res
          .status(400)
          .send({ error: 'There is already a plan with the same tile' });
      }
    }
    const result = await Plan.update(req.body, {
      where: { id: plan.id },
      returning: true,
      plain: true,
    });

    const { id, title, duration, price } = result[1];
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    try {
      await Plan.destroy({ where: { id: req.params.id } });
      return res.status(200).send({
        error: 'The plan was deleted',
      });
    } catch (error) {
      return res.status(500).send({
        error: 'Internal Server Error',
      });
    }
  }
}
export default new PlanController();
