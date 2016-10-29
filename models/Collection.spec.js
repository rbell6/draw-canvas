'use strict';
describe('Collection', () => {
	var Collection = require('./Collection');
	var collection;
	var item = {
		id: '123',
		name: 'bilbo'
	};
	var item2 = {
		id: '456',
		name: 'frodo'
	};

	beforeEach(() => {
		collection = new Collection();
	});

	it('should add items to the collection', () => {
		collection.add(item);
		expect(collection.get(item)).toBe(item);
		expect(collection.length).toEqual(1);

		collection.add(item2);
		expect(collection.length).toEqual(2);
	});

	it('should remove items from the collection', () => {
		collection.add(item);
		collection.add(item2);
		expect(collection.length).toEqual(2);

		collection.remove(item);
		expect(collection.length).toEqual(1);

		collection.add(item);
		collection.removeAll();
		expect(collection.length).toEqual(0);
	});

	it('should get items from the collection', () => {
		collection.add(item);
		collection.add(item2);
		expect(collection.get(item)).toBe(item);
		expect(collection.getAtIndex(1)).toBe(item2);
	});

	it('should emit events', () => {
		var added, removed;
		collection.on('add', o => added = o);
		collection.add(item);
		expect(added).toBe(item);

		collection.on('remove', o => removed = o);
		collection.remove(item);
		expect(removed).toBe(item);
	});

	it('should toJSON', () => {
		collection.add(item);
		expect(collection.toJSON()).toContain(item);

		// Nested collections
		var innerCollection = new Collection();
		collection.add(innerCollection);
		innerCollection.add(item2);
		expect(collection.toJSON()[1]).toContain(item2);
	});

});