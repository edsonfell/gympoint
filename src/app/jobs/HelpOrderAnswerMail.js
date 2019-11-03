import Mail from '../../lib/Mail';

class HelpOrderAnswerMail {
  // Every job created must have a unique key to be indentified
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const help = data.result;

    await Mail.sendMail({
      to: `${help.student.name} <${help.student.email}>`,
      student_name: help.student.name,
      subject: 'Your question got answered!',
      template: 'help-order',
      context: {
        question: help.question,
        answer: help.answer,
      },
    });
  }
}

export default new HelpOrderAnswerMail();
