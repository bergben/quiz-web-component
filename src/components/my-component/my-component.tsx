import { Component, h, State, Prop } from '@stencil/core';
import { questions } from './questions';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import { results } from './results';
// tslint:disable-next-line:no-duplicate-imports
import { PaperRadioButtonElement } from '@polymer/paper-radio-button/paper-radio-button.js';


@Component({
  tag: 'lauch-quiz',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  @State()
  private currentQuestionIndex = 0;

  @Prop()
  questions = questions;

  @Prop()
  results = results;

  private answers: string[] = [];

  private radioButtons: PaperRadioButtonElement[] = [];

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  get isQuizFinished() {
    if(!this.currentQuestion) {
      return true;
    }
    return false;
  }

  private pickAnswer(value: string) {
    setTimeout(() => {
      this.answers.push(value);
      this.currentQuestionIndex++;
      (this.radioButtons[value] as PaperRadioButtonElement).checked = false;
    }, 400);
  }

  private getAnswers() {
    const answers = [];
    for(let i = 0; i < this.currentQuestion.answers.length; i++) {
      const currentAnswer = this.currentQuestion.answers[i];
      answers.push(
      <paper-radio-button name={currentAnswer.value}
        ref={el => this.radioButtons[currentAnswer.value]=el}
        onclick={() => this.pickAnswer(currentAnswer.value)}>
        {currentAnswer.label}
      </paper-radio-button>);
    }
    return answers;
  }

  private getCurrentQuestionTemplate() {
    return (
        <paper-radio-group>
          {this.getAnswers()}
        </paper-radio-group>
    );
  }

  private getResultValue() {
    const value = this.maxCount(this.answers.join('')) as unknown as string;
    return this.results.find(result => result.value === value);
  }

  private getResultTemplate() {
    return <p>{this.getResultValue().label}</p>
  }

  private getQuizTemplate() {
    return <div>
      <p>{this.currentQuestion.question}</p>
      {this.getCurrentQuestionTemplate()}
    </div>;
  }

  render() {
    return this.isQuizFinished ? this.getResultTemplate() : this.getQuizTemplate();
  }
  
  private maxCount(input) {
    const {max, ...counts} = (input || "").split("").reduce(
    (a, c) => {
        a[c] = a[c] ? a[c] + 1 : 1;
        a.max = a.max < a[c] ? a[c] : a.max;
        return a;
    },
    { max: 0 }
    );

    return Object.entries(counts).filter(([_, v]) => v === max)[0][0];
  }
}
