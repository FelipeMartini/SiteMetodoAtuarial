import fs from 'fs';
import fsp from 'fs/promises';
import { spawn } from 'child_process';
import _ from 'lodash';
import { marked } from 'marked';
import Promise from 'promise';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const documentationDir = './src/app/(public)/documentation';
const exampleComponentsDir = path.resolve(documentationDir, './components/ui/material-ui-components');
const viewComponentsDir = path.resolve(documentationDir, './components/views/material-ui-components');
const routesDir = path.resolve(documentationDir, './MaterialUIComponentsRoutes.tsx');
const navigationFilePath = path.resolve(documentationDir, './lib/constants/materialUIComponentsNavigation.ts');
const projectDir = path.resolve(documentationDir, '..', '..', '..', '..');
const nodeModulesDir = path.resolve(projectDir, 'node_modules');

const demoRegexp = /^"demo": "(.*)"/;
const componentRegexp = /^"component": "(.*)"/;
const headerRegExp = /---[\r\n]([\s\S]*)[\r\n]---/;
const emptyRegExp = /^\s*$/;

marked.Lexer.prototype.lex = function lex(src) {
	src = src
		.replace(/\r\n|\r/g, '\n')
		.replace(/\t/g, '    ')
		.replace(/\u2424/g, '\n');

	this.blockTokens(src, this.tokens);

	let next: { src: string; tokens: { type: string; raw: string }[] };

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore

	while ((next = this.inlineQueue.shift() as { src: string; tokens: { type: 'space'; raw: string }[] })) {
		this.inlineTokens(next.src, next.tokens);
	}

	return this.tokens;
};

const renderer = new marked.Renderer();

marked.setOptions({
	gfm: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartypants: false,
	renderer
});

renderer.heading = (text, level) => {
	let className = '';
	switch (level) {
		case 1:
			className = 'text-5xl my-4 font-bold';
			break;
		case 2:
			className = 'text-3xl mt-6 mb-2.5 font-bold';
			break;
		case 3:
			className = 'text-lg mt-5 mb-2.5 font-bold';
			break;
		default:
			className = 'text-base mt-3 mb-2.5';
	}

	return `<Typography className="${className}" component="h${level}">${text}</Typography>\n`;
};

renderer.paragraph = (text) => {
	return `<Typography className="text-base mb-8" component="div">${text}</Typography>\n`;
};

renderer.code = (code, lang) => {
	const response = `
<FuseHighlight component="pre" className="language-${lang}">
{%% 
${code}
%%}
</FuseHighlight>
`;
	return response.replace(/`/g, '\\`').replace(/%%/g, '`');
};

renderer.codespan = (code: string) => {
	const response = `<code>{@@${_.unescape(code)}@@}</code>`;
	return response.replace(/@@/g, '`');
};

const removeFile = async (filePath: string) => {
	try {
		const ifExists = await checkExistence(filePath);

		if (!ifExists) {
			return true;
		}

		await fsp.unlink(filePath);

		log('Successfully deleted the file.');
	} catch (error) {
		if (error) {
			// log('File does not exist.', filePath);
		}
	}
	return true;
};

const renameFilePath = async (filePath: string, newPath: string) => {
	try {
		if (fsp.access(filePath)) {
			await fsp.rename(filePath, newPath);
			log('Successfully renamed the file.', newPath);
		}
	} catch (error) {
		if (error) {
			log('Cannot be renamed.', filePath);
		}
	}
};

async function checkExistence(dirPath: string) {
	try {
		await fsp.access(dirPath);
		// If the promise resolves, the file or directory exists
		return true;
	} catch (_error) {
		// log(_error);
		// If the promise is rejected, the file or directory does not exist
		return false;
	}
}

const rmDir = async (dirPath: string) => {
	try {
		const isExist = await checkExistence(dirPath);

		if (!isExist) {
			return true;
		}

		const stats = await fsp.stat(dirPath);

		if (!stats.isDirectory()) {
			return true;
		}

		// Read directory contents
		const files = await fsp.readdir(dirPath);

		// Delete each item in the directory
		const deletePromises = files.map(async (file) => {
			const filePath = path.join(dirPath, file);
			const fileStat = await fsp.stat(filePath);

			if (fileStat.isDirectory()) {
				return rmDir(filePath); // Recursive call
			}

			return fsp.unlink(filePath);
		});

		await Promise.all(deletePromises);

		await fsp.rmdir(dirPath);
		// Remove the directory itself
		// await rmDir(dirPath);
	} catch (error) {
		if (error) {
			log(error);
		}
	}
	return true;
};

function allReplace(str: string, obj: Record<string, string>): string {
	let retStr = str;
	Object.keys(obj).forEach((key) => {
		retStr = retStr.replace(new RegExp(key, 'g'), obj[key]);
	});
	return retStr;
}

function getContents(markdown: string) {
	return markdown
		.replace(headerRegExp, '') // Remove header information
		.split(/^{{|}}$/gm) // Split markdown into an array, separating demos
		.filter((content) => !emptyRegExp.test(content)); // Remove empty lines
}

const excludedDemos = [
	'ComboBox.js',
	'DashboardLayoutBasic.js',
	'PageContainerBasic.js',
	'PageContainerBasic.js',
	'ToolpadDialogsNoSnap.js',
	'ToolpadDialogs.js'
	// Add other demo filenames you want to exclude
];

function getHtmlCode(markdownSource: string, fileDir: string) {
	const folderName = path.basename(fileDir);

	markdownSource = eraseMdSection(markdownSource, folderName, 'breadcrumbs', 'Integration with react-router');
	markdownSource = eraseMdSection(markdownSource, folderName, 'pagination', 'Router integration');

	markdownSource = markdownSource.replace(
		/:::info([\s\S]*?):::/g,
		'<div className="border-1 p-4 rounded-xl my-3">\n$1\n</div>'
	);

	let contentsArr = getContents(markdownSource);
	const importPathList = [];
	contentsArr = contentsArr.map((content) => {
		const match = content.match(demoRegexp);
		const isMuiYou = content.match(/MaterialYouPlayground/);

		if (match && !isMuiYou) {
			const demoOptions = JSON.parse(`{${content}}`) as { demo: string; iframe?: boolean };
			const name = demoOptions.demo;

			// Check if the demo is in the excluded list
			if (excludedDemos.includes(name)) {
				return ''; // Skip rendering this demo
			}

			const nameWithoutExt = path.basename(name, path.extname(name));

			const tsxFilePath = path.resolve(fileDir, `${nameWithoutExt}.tsx`);
			const tsFilePath = path.resolve(fileDir, `${nameWithoutExt}.ts`);
			const jsFilePath = path.resolve(fileDir, `${nameWithoutExt}.js`);
			const jsxFilePath = path.resolve(fileDir, `${nameWithoutExt}.jsx`);

			let fileType = '';

			if (fs.existsSync(tsxFilePath)) {
				removeFile(tsFilePath);
				removeFile(jsFilePath);
				removeFile(jsxFilePath);
				fileType = 'tsx';
			} else if (fs.existsSync(tsFilePath)) {
				removeFile(jsFilePath);
				removeFile(jsxFilePath);
				renameFilePath(tsFilePath, tsxFilePath);
				fileType = 'ts';
			} else if (fs.existsSync(jsFilePath) && fs.existsSync(jsxFilePath)) {
				removeFile(jsFilePath);
				fileType = 'jsx';
			} else if (fs.existsSync(jsFilePath)) {
				renameFilePath(jsFilePath, jsxFilePath);
				fileType = 'jsx';
			} else {
				return '';
			}

			if (fileType !== '') {
				const componentPath = `../../../ui/material-ui-components/${folderName}/${nameWithoutExt}`;

				const iframe = !!demoOptions.iframe;

				const componentNameVar = `${nameWithoutExt}Component`;
				const componentRawVar = `${nameWithoutExt}Raw`;

				importPathList.push(`import ${componentNameVar} from '${componentPath}';`);
				importPathList.push(`import ${componentRawVar} from '${componentPath}.${fileType}?raw';`);

				return `\n<FuseExample
                    name="${name}"
                    className="my-4"
                    iframe={${iframe}}
                    component={${componentNameVar}} 
                    raw={${componentRawVar}}
                    />`;
			}

			return '';
		}

		const muiComponent = content.match(componentRegexp);

		if (muiComponent) {
			return '';
		}

		return content;
	});

	const htmlCode = marked(contentsArr.join(''))
		.replace(/"{/g, '{')
		.replace(/}"/g, '}')
		.replace(/(<\s*\/?\s*)p(\s*([^>]*)?\s*>)/g, '$1Typography$2')
		.replace(/class=/g, 'className=')
		.replace(/<img([^>]+)>/gi, '<img$1/>')
		.replace(/<br>/g, '<br/>')
		.replace(/\/static\//g, '/material-ui-static/')
		.replace(/<!-- #default-branch-switch -->/g, '')
		.replace(/<ul>/g, '<ul className="space-y-4">')
		.replace(/<ul start="(\d+)">/g, '<ul className="space-y-4" start={$1}>')
		.replace(/<ol start="(\d+)">/g, '<ol start={$1}>')
		.replace(/<codeblock[\s\S]*?>/g, '<div className="space-y-3">')
		.replace(/<\/codeblock>/g, '</div>')
		.replace(/<!--[\s\S]*?-->/g, '');

	return { htmlCode, importPaths: importPathList.join('\n') };
}

function eraseMdSection(content: string, folderName: string, requestedDir: string, title: string) {
	if (folderName !== requestedDir) {
		return content;
	}

	const regex = new RegExp(`## ${title}[\\s\\S]*?(?=##)`, 'g');
	return content.replace(regex, '');
}

function readDir(dir: string) {
	return new Promise<{ dir: string; list: string[] }>((resolve, reject) => {
		fs.readdir(dir, (err, list) => {
			if (err) {
				reject(err);
			}

			resolve({
				dir,
				list
			});
		});
	});
}

function writePages(dir: string, list: string[]): Promise<string[]> {
	const pages: string[] = [];
	return new Promise<string[]>((resolve, reject) => {
		list.forEach((file: string) => {
			file = path.resolve(dir, file);
			pages.push(path.basename(file));

			fs.stat(file, (err: NodeJS.ErrnoException | null, stat: fs.Stats) => {
				if (err) {
					// Handle the error if needed
					reject(err);
					return;
				}

				if (stat && stat.isDirectory()) {
					writePage(file);
				}
			});
		});

		resolve(pages);
	});
}

function writePage(fileDir: string) {
	const mdFileName = `${path.basename(fileDir)}.md`;
	const markdownSource = fs.readFileSync(`${fileDir}/${mdFileName}`, 'utf8');
	const fileName = _.upperFirst(_.camelCase(path.basename(fileDir)));
	const { htmlCode, importPaths } = getHtmlCode(markdownSource, fileDir);

	const componentContent = `
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
${importPaths}

function ${fileName}Doc(props) {
	return (
		<>
			<Button 
				className="normal-case absolute right-0 not-prose"
				variant="contained"
				color="secondary"
				component="a" 
				href="https://mui.com/components/${path.basename(fileDir)}" 
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>lucide:square-arrow-out-up-right</FuseSvgIcon>}
			>
				Reference
			</Button>
			${htmlCode}
		</>
	);
}

export default ${fileName}Doc;
`;

	/*
	const pageContent = `import ${fileName}Doc from '../../../components/views/material-ui-components/${path.basename(fileDir)}/${fileName}Doc';

export default ${fileName}Doc;
`;
*/
	// Write the view component file
	const viewComponentDir = path.resolve(viewComponentsDir, path.basename(fileDir));
	fs.mkdirSync(viewComponentDir, { recursive: true });
	fs.writeFileSync(path.resolve(viewComponentDir, `${fileName}Doc.tsx`), componentContent);

	/*
	// Write the page file
	const routeDir = path.resolve(routesDir, path.basename(fileDir));
	fs.mkdirSync(routeDir, { recursive: true });
	fs.writeFileSync(path.resolve(routeDir, 'page.tsx'), pageContent);
	*/
}

function writeRouteFile(pages: string[]) {
	const importPath = "const %s = lazy(() => import('./components/views/material-ui-components/%r/%s'));";

	const imports = pages.map((page) => {
		const componentName = _.upperFirst(_.camelCase(page)) + 'Doc';
		return importPath.replace(/%r/g, page).replace(/%s/g, componentName);
	});

	const routeObject = "{ path : '%s', element: <%p />}";
	const routes = pages.map((page) => {
		const componentName = _.upperFirst(_.camelCase(page)) + 'Doc';

		const newRouteObject = allReplace(routeObject, {
			'%s': page,
			'%p': componentName
		});
		return newRouteObject;
	});

	const content = `
		import { lazy } from 'react';
		import { Navigate } from 'react-router';
		import documentationLayoutSettings from '@/app/(public)/documentation/lib/constants/documentationLayoutSettings';
		import DocumentationLayout from '@/app/(public)/documentation/components/layout/DocumentationLayout';

        ${imports.join('')}
        
        const MaterialUIComponentsRoutes =  [
				{
					path: '',
					element: <Navigate to="accordion" />
					},
					${routes.join()}
				];
        
        export default MaterialUIComponentsRoutes;
        
        `;

	fs.writeFileSync(path.resolve(routesDir), content);
}

function writeNavigationFile(pages: string[]) {
	const navigation = pages.map((page) => {
		const componentName = _.startCase(page);
		return `
			{
				id: '${_.camelCase(page)}',
				title: '${componentName}',
				type: 'item',
				url: '/documentation/material-ui-components/${page}'
			}`;
	});

	const content = `
        const materialUIComponentsNavigation = {
			id: 'material-ui-components',
			title: 'Material UI Components',
			type: 'collapse',
			icon: 'lucide:layers',
			children: [${navigation.join()}]
		};
												
        export default materialUIComponentsNavigation;
        `;
	fs.writeFileSync(path.resolve(navigationFilePath), content);
}

function filewalker(dir: string) {
	return new Promise<string[]>((resolve, reject) => {
		let results: string[] = [];

		fs.readdir(dir, (err, list) => {
			if (err) {
				reject(err);
				return;
			}

			let pending = list.length;

			if (!pending) {
				resolve(results);
				return;
			}

			list.forEach((file) => {
				file = path.resolve(dir, file);

				fs.stat(file, (_err, stat) => {
					if (_err) {
						reject(_err);
						return;
					}

					// If directory, make a recursive call
					if (stat && stat.isDirectory()) {
						filewalker(file)
							.then((__res) => {
								results = results.concat(__res);
								pending -= 1;

								if (!pending) {
									resolve(results);
								}
							})
							.catch(reject);
					} else {
						results.push(file);
						pending -= 1;

						if (!pending) {
							resolve(results);
						}
					}
				});
			});
		});
	});
}

async function replaceInExamples() {
	const list = await filewalker(exampleComponentsDir);

	list.forEach((file) => {
		const fileSource = fsp.readFile(file, 'utf8');

		fileSource.then((result) => {
			result = result
				.replace(
					'docs/src/modules/components/HighlightedCode',
					'@/app/(public)/documentation/components/ui/HighlightedCode'
				)
				.replace('@mui/docs/HighlightedCode', '@/app/(public)/documentation/components/ui/HighlightedCode')
				.replace(
					/docs\/src\/modules\/utils\/compose/g,
					'@/app/(public)/documentation/material-ui-components/utils/compose'
				)
				.replace(
					/docs\/src\/modules\/components\/MarkdownElement/g,
					'@/app/(public)/documentation/components/ui/MarkdownElement'
				)
				.replace(
					/docs\/src\/modules\/components\/HighlightedCode/g,
					'@/app/(public)/documentation/components/ui/HighlightedCode'
				)
				.replace(/\/static\//g, '/material-ui-static/')
				.replace(/## Experimental API[\s\S]*$/, ''); // Remove experimental API

			try {
				fsp.writeFile(file, result, 'utf8');
			} catch (error) {
				log(error);
			}
		});
	});
}

async function removeExcludedComponents() {
	const excludedComponents = [
		path.resolve(exampleComponentsDir, './hidden'),
		path.resolve(exampleComponentsDir, './use-media-query'),
		path.resolve(exampleComponentsDir, './about-the-lab'),
		path.resolve(exampleComponentsDir, './material-icons'),
		path.resolve(exampleComponentsDir, './icons'),
		path.resolve(exampleComponentsDir, './portal'),
		path.resolve(exampleComponentsDir, './textarea-autosize'),
		path.resolve(exampleComponentsDir, './no-ssr'),
		path.resolve(exampleComponentsDir, './click-away-listener')
	];

	try {
		excludedComponents.forEach(async (_path) => rmDir(_path));
	} catch (writeErr: unknown) {
		log(writeErr);
	}
}

async function removeUnnecessaryFiles() {
	return filewalker(exampleComponentsDir)
		.then((list) => {
			return list.forEach(async (file) => {
				const extToRemove = [
					'.preview',
					'.tsx.preview',
					// '.js',
					// '.jsx',
					'-de.md',
					'-es.md',
					'-fr.md',
					'-ja.md',
					'-pt.md',
					'-ru.md',
					'-zh.md'
				];

				extToRemove.forEach(async (str) => {
					if (str && file?.endsWith(str)) {
						await removeFile(file);
					}
				});
			});
		})
		.catch((err) => {
			if (err) {
				throw err;
			}
		});
}

async function componentFileTypeCorrection() {
	return filewalker(exampleComponentsDir)
		.then(async (list) => {
			list.forEach(async (filePath) => {
				if (path.extname(filePath) === '.js') {
					/** if there is tsx version of the file, remove js file */
					const newFilePath = filePath.replace('.js', '.tsx');

					if (fs.existsSync(newFilePath)) {
						await removeFile(filePath);
						log(`Removed ${filePath}`);
					}
					// const newFilePath = filePath.replace('.js', '.jsx');

					// await renameFilePath(filePath, newFilePath);
					// log(`Renamed ${filePath} to ${newFilePath}`);

					await removeFile(filePath);
				}
			});
		})
		.catch((err) => {
			if (err) {
				throw err;
			}
		});
}

async function build() {
	log('Start building...');

	await rmDir(viewComponentsDir);

	log('PagesDirectory removed.');

	await removeExcludedComponents();

	log('Exclude components removed.');

	await removeFile(path.resolve(exampleComponentsDir, './.eslintrc.js'));

	log('Eslint file removed.');

	await removeUnnecessaryFiles();

	log('Unnecessary files removed.');

	await componentFileTypeCorrection();

	await replaceInExamples();

	log('Replace in examples done.');

	fs.mkdirSync(viewComponentsDir);

	log('PagesDirectory created.');

	readDir(exampleComponentsDir).then(({ dir: _dir, list }) => {
		writePages(_dir, list).then(async (pages) => {
			writeRouteFile(pages);

			log('Route file created.');

			writeNavigationFile(pages);

			log('Navigation file created.');

			await runLint();
		});
	});
}

async function runLint() {
	const eslintPath = path.resolve(projectDir, './node_modules/.bin/eslint');
	const eslintConfigPath = path.resolve(projectDir, './eslint.config.mjs');

	const tempConfigPath = path.join(nodeModulesDir, '.temp-eslint.mjs');

	async function createEslintConfig() {
		const configContent = `
					import baseConfig from '${eslintConfigPath}';
					
					export default baseConfig.map(config => {
						return {
							...config,
							ignores: [],
							languageOptions: {
								...config.languageOptions,
								parserOptions: {
									...config.languageOptions?.parserOptions,
									project: null,
									tsconfigRootDir: null
								}
							},
							rules: {
								...config.rules,
								'@typescript-eslint/no-unused-vars': 'off',
								'no-irregular-whitespace': 'off',
								'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
								'react/jsx-boolean-value': ['error', 'never']
							}
						};
					});
				`;
		await fsp.writeFile(tempConfigPath, configContent);
	}

	createEslintConfig();

	process.chdir(projectDir);

	async function runEslintCommand(filesDir: string) {
		return runCommand(eslintPath, [`${filesDir}`, '--fix', '--config', tempConfigPath]);
	}

	const promises = [
		runEslintCommand(exampleComponentsDir),
		runEslintCommand(viewComponentsDir),
		runEslintCommand(routesDir),
		runEslintCommand(navigationFilePath)
	];

	return Promise.all(promises)
		.then(() => {
			log('Linting done.');
			log(`Done`);
		})
		.catch((err) => {
			if (err) {
				log(err);
			}
		})
		.finally(async () => {
			log('Eslint format completed.');
			await removeFile(tempConfigPath);
		});
}

function runCommand(command: string, args: string[]) {
	return new Promise((resolve, reject) => {
		const process = spawn(command, args);

		process.stdout.on('data', (data) => {
			log(`stdout: ${data}`);
		});

		process.stderr.on('data', (data) => {
			log(`stderr: ${data}`);
		});

		process.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Command "${command}" exited with code ${code}`));
				return;
			}

			resolve();
		});
	});
}

function log(message: unknown, message2?: unknown) {
	// eslint-disable-next-line no-console
	console.info(message, message2);
}

build();
