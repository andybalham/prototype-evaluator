export class EvaluationLog {
    pushArgs(name: string, args: any): void {
        console.log(JSON.stringify({name, args}));
    }
    pushResult(name: string, result: any): void {
        console.log(JSON.stringify({name, result}));
    }
}