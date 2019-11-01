import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class EnrollMail {
  // Every job created must have a unique key to be indentified
  get key() {
    return 'EnrollMail';
  }

  async handle({ data }) {
    const enroll = data.result;

    await Mail.sendMail({
      to: `${enroll.student.name} <${enroll.student.email}>`,
      subject: 'New Plan in Gympoint!',
      template: 'enroll',
      context: {
        plan_title: enroll.plan.title,
        student_name: enroll.student.name,
        start_date: format(parseISO(enroll.start_date), "'dia' dd'/'MM'", {
          locale: pt,
        }),
        end_date: format(parseISO(enroll.end_date), "'dia' dd'/'MM'", {
          locale: pt,
        }),
        total_price: enroll.price,
      },
    });
  }
}

export default new EnrollMail();
