namespace US {
    export namespace Map {
        export namespace Cell {
            export type Neighbor = { _id: string, ground: string }
        }
        export type Cell = {
            _id: string,
            ground: string,
            done: boolean,
            neighbors: {
                top: Map.Cell.Neighbor,
                right: Map.Cell.Neighbor,
                left: Map.Cell.Neighbor,
                bottom: Map.Cell.Neighbor
            }
        }
    }
}