'use strict';
fdescribe('CollectionNew', () => {
	let CollectionNew = require('./CollectionNew');
	let collection;
	let item = {
		id: '123',
		name: 'bilbo'
	};
	let item2 = {
		id: '456',
		name: 'frodo'
	};

	beforeEach(() => {
		collection = new CollectionNew();
	});

	it('should add items to the collection', () => {
		collection.push(item);
		expect(collection.find(i => i.id === item.id)).toBe(item);
		expect(collection.length).toEqual(1);

		collection.push(item2);
		expect(collection.length).toEqual(2);
	});

	it('should remove items from the collection', () => {
		collection.push(item);
		collection.push(item2);
		expect(collection.length).toEqual(2);

		collection.remove(item);
		expect(collection.length).toEqual(1);

		collection.push(item);
		collection.removeAll();
		expect(collection.length).toEqual(0);
	});

	it('should get items from the collection', () => {
		collection.push(item);
		collection.push(item2);
		expect(collection.find(cItem => cItem.id === item.id)).toBe(item);
		expect(collection[1]).toBe(item2);
	});

	it('should emit events', () => {
		var added, removed;
		collection.on('add', o => added = o.data);
		collection.push(item);
		expect(added[0]).toBe(item);

		collection.on('remove', o => removed = o.data);
		collection.remove(item);
		expect(removed[0]).toBe(item);
	});
});
