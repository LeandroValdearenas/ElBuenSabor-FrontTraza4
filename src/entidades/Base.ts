export default abstract class Base {
    id:number = 0;
    [x: string]: any;

    static nombre:string = '';
    static labels:string[] = [];
}