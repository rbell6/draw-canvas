'use strict';
describe('Model', () => {
	var Model = require('./Model');
	var model;

	beforeEach(() => {
		model = new Model();
	});

	it('should set and get', () => {
		var car = new Model();
		car.set('color', 'green');
		expect(car.get('color')).toEqual('green');

		var truck = new Model({
			size: 'big'
		});
		expect(truck.get('size')).toEqual('big');
	});

	it('should emit events', () => {
		var numWheels;
		var vanChanged = false;
		var van = new Model();
		van.on('change:wheels', e => numWheels = e.newValue);
		van.on('change', e => vanChanged = true);
		van.set('wheels', 4);
		expect(numWheels).toEqual(4);
		expect(vanChanged).toBeTruthy();
	});

	it('should toJSON', () => {
		var bike = new Model({
			wheels: 2
		});
		bike.set('color', 'black');
		bike.height = 42;
		var json = bike.toJSON();
		expect(json.wheels).toEqual(2);
		expect(json.color).toEqual('black');
		expect(json.height).toBeUndefined();

		// Nested model
		var seat = new Model();
		seat.set('padding', '100%');
		bike.set('seat', seat);
		json = bike.toJSON();
		expect(json.seat.padding).toEqual('100%');
	});

	it('should accept defaults', () => {
		class Car extends Model {
			static defaults() {
				return {
					numWheels: 4
				};
			}
		}
		var bus = new Car();
		expect(bus.get('numWheels')).toEqual(4);
	});

});