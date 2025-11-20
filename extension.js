const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {
    console.log('Dark Modern Theme Auto-Reload is now active!');

    // Watch for changes in the theme file
    const themePath = path.join(context.extensionPath, 'themes', 'dark-modern-theme.json');
    
    if (fs.existsSync(themePath)) {
        fs.watchFile(themePath, (curr, prev) => {
            console.log('Theme file changed, reloading...');
            
            // Reload the theme by triggering a color theme change
            const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            
            // Switch to a different theme briefly, then back
            vscode.workspace.getConfiguration('workbench').update('colorTheme', 'Default Dark Modern', true)
                .then(() => {
                    setTimeout(() => {
                        vscode.workspace.getConfiguration('workbench').update('colorTheme', currentTheme, true);
                    }, 100);
                });
        });

        // Create a status bar item to show auto-reload is active
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = '$(sync~spin) Theme Auto-Reload';
        statusBarItem.tooltip = 'Theme auto-reload is active';
        statusBarItem.show();
        
        context.subscriptions.push(statusBarItem);
    }
}

function deactivate() {
    console.log('Dark Modern Theme Auto-Reload deactivated');
}

module.exports = {
    activate,
    deactivate
};
