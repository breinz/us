export default interface IPnj {
    x: number;
    y: number;

    params: React.ReactElement<"div">;

    animate: (start: boolean, angle?: number) => void;
}