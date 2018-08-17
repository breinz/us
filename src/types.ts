export namespace MapType {
    export namespace Cell {
        export type Neighbor = { _id: string, ground: string }
    }
    export type Cell = {
        _id: string,
        ground: string,
        neighbors: {
            top: MapType.Cell.Neighbor,
            right: MapType.Cell.Neighbor,
            left: MapType.Cell.Neighbor,
            bottom: MapType.Cell.Neighbor
        }
    }
}
