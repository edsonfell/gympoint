import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (!studentExist) {
      const { id, name, email } = await Student.create(req.body);
      return res.json({
        id,
        name,
        email,
      });
    }
    return res
      .status(400)
      .send({ error: 'E-mail already used by another Student' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number(),
      height: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'Data validation failed' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).send({ error: 'User not found' });
    }
    const emailCheck = req.body.email;
    // Checando se o e-mail passado é diferente do cadastrado.
    // Caso seja, é pq o usuário quer alterar o e-mail
    if (emailCheck != null && emailCheck !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });
      if (studentExists) {
        return res.status(400).send({ error: 'E-mail already used' });
      }
    }

    const result = await Student.update(req.body, {
      where: { id: student.id },
      returning: true,
      plain: true,
    });
    const { id, name, email, age, weight, height } = result[1];
    return res.send({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}
export default new StudentController();
