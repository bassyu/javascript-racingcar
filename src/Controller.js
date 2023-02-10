import { NAME_DELIMITER, MOVE_NUMBER } from './constants/index.js';
import Car from './models/Car.js';
import Console from './utils/Console.js';
import randomNumberInRange from './utils/RandomNumberInRange.js';
import Validator from './utils/Validator.js';
import View from './View.js';

class Controller {
  #cars;

  constructor() {
    this.#cars = [];
  }

  async play() {
    await this.#initCars();
    this.#raceStart(await this.#initCount());
    this.#presentWinner();
    Console.close();
  }

  async #initCars() {
    View.naming();
    const names = await this.#readNames();
    this.#cars = names.map((name) => new Car(name));
  }

  async #initCount() {
    View.tryCount();
    const count = await this.#readTryCount();
    View.newLine();

    return count;
  }

  #raceStart(count) {
    View.resultTitle();
    View.carProgress(this.#getCarsData());
    for (let i = 0; i < count; i += 1) {
      this.#cars.forEach(this.#judgeMove);
      View.carProgress(this.#getCarsData());
    }
  }

  #judgeMove(car) {
    const { randomMin, randomMax, threshold } = MOVE_NUMBER;
    if (randomNumberInRange(randomMin, randomMax) >= threshold) car.move();
  }

  #presentWinner() {
    View.winner(this.#judgeWinner());
  }

  #judgeWinner() {
    const carsData = this.#getCarsData();
    const max = Math.max(...carsData.map((car) => car.distance));
    return carsData.filter((car) => car.distance === max).map((car) => car.name);
  }

  #getCarsData() {
    return this.#cars.map((car) => {
      return { name: car.getName(), distance: car.getDistance() };
    });
  }

  async #readNames() {
    try {
      const input = await Console.read();
      Validator.checkNames(input);
      return input.split(NAME_DELIMITER);
    } catch (e) {
      View.error(e);
      return this.#readNames();
    }
  }

  async #readTryCount() {
    try {
      const input = await Console.read();
      Validator.checkIntegerNumber(input);
      return Number(input);
    } catch (e) {
      View.error(e);
      return this.#readTryCount();
    }
  }
}

export default Controller;
