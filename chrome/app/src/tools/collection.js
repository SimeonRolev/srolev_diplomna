class CollectionItem {
    constructor (item, id) {
        this.id = id;
        this.item = item;
        this.selected = false;
    }

    select () {
        this.selected = true;
    }

    deselect () {
        this.selected = false
    }
}

class Collection {
    constructor(items=[], idFunc) {
        this.items = items.map(item => new CollectionItem(item, idFunc(item)));
    }

    get (id) {
        return this.items.find(item => item.id === id)
    }

    deselectAll () {
        this.items.map(item => item.deselect())
    }

    select (id) {
        this.deselectAll()
        const item =this.get(id)
        item.select()
        return item;
    }
}

export default Collection;