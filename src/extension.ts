// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const handleDidChangeTreeData = new vscode.EventEmitter<string | null | undefined>();
let searchResults: string[] = [];

class SearchTreeDataProvider implements vscode.TreeDataProvider<string> {
    constructor(
    ) {
    }

    onDidChangeTreeData = handleDidChangeTreeData.event;

    getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return {
			label : element,
			collapsibleState: vscode.TreeItemCollapsibleState.None
		};
    }

    getChildren(_element?: string | undefined): vscode.ProviderResult<string[]> {
        return searchResults;
    }

}
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('theia.seach.test.start', () => {
		searchResults = [];
		vscode.window.showInputBox().then(what => {
			if (what) {
				const workspace: any = vscode.workspace;
				let count = 0;
				if (workspace.findTextInFiles) {
					const query = {
						pattern: what,
						isRegExp: false
					};
					workspace.findTextInFiles(query, {}, (result: any) => {
						console.log(result);
						if (result.preview) {
							searchResults.push(count + ': ' + result.preview.text);
						}
						count++;
						handleDidChangeTreeData.fire('');
					});
				}
			}
			handleDidChangeTreeData.fire('');
		});
	});

	context.subscriptions.push(disposable);

	disposable = vscode.window.registerTreeDataProvider('theia.seach.test.treeview',
        new SearchTreeDataProvider()
    );

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
