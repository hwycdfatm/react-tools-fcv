import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
	const [inputValue, setInputValue] = useState('')
	const [result, setResult] = useState('')
	const [option, setOption] = useState('dl')
	const resultRef = useRef(null)
	const [objDl, setObjDl] = useState({
		dl: '',
		dt: '',
		dd: '',
	})

	const [objUl, setObjUl] = useState({
		ul: '',
		li: '',
	})

	const arrDl = ['dl', 'dt', 'dd']
	const arrUl = ['ul', 'li']

	const handleClassDl = (e) => {
		const { name, value } = e.target
		setObjDl({ ...objDl, [name]: value })
	}

	const handleClassUl = (e) => {
		const { name, value } = e.target
		setObjUl({ ...objUl, [name]: value })
	}

	const handleChangeOption = (e) => {
		const { id } = e.target
		setOption(id)
	}

	const handleTrim = (string) => {
		string = string.trim()
		if (!string || string === undefined || string === '') return ''

		if (option === 'dl') {
			const { dl, dt, dd } = objDl
			const temp =
				string.replace(/\n\n/g, '|').replace(/\n/g, '-').split('|') || []
			const result = temp.map((str) => str.split('-')) || []
			let str = ''
			for (let i = 0; i < result.length; i++) {
				const tempArray = result[i]
				str += `<dl${
					dl.trim() !== '' ? ' class="' + dl + '"' : ''
				}>\n${'\t'}<dt${dt.trim() !== '' ? ' class="' + dt + '"' : ''}>${
					tempArray[0]?.trim() || ''
				}</dt>\n${'\t'}<dd${dd.trim() !== '' ? ' class="' + dd + '"' : ''}>${
					tempArray[1]?.trim() || ''
				}</dd>\n</dl>\n`
			}
			return str
		}
		if (option === 'ul') {
			const { ul, li } = objUl

			const temp = string.replace(/\n/gm, '-').split('-') || []
			let str = `<ul${ul.trim() !== '' ? ' class="' + ul + '"' : ''}>\n`
			for (let i = 0; i < temp.length; i++) {
				if (temp[i] === '') continue
				str += `${'\t'}<li${
					li.trim() !== '' ? ' class="' + li + '"' : ''
				}>${temp[i]?.trim()}</li>\n`
			}
			return str + '</ul>'
		}
	}

	const render = () => {
		const html = handleTrim(inputValue)
		setResult(html)
	}

	useEffect(() => {
		render()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputValue, option, objDl, objUl])

	const toast = (typ = 'tc') => {
		const alertNode = document.createElement('div')
		if (typ === 'tc') {
			alertNode.className = 'alert'
			alertNode.innerHTML = '<p>Copied!</p>'
		} else {
			alertNode.className = 'alert fail'
			alertNode.innerHTML = '<p>Nothing to copy!</p>'
		}
		document.body.appendChild(alertNode)
		setTimeout(() => {
			document.body.removeChild(alertNode)
		}, 3000)
	}

	const handleCopy = () => {
		if (result !== '') {
			if (window.getSelection) {
				const range = document.createRange()
				range.selectNode(resultRef.current)
				window.getSelection().removeAllRanges()
				window.getSelection().addRange(range)
			}
			navigator.clipboard.writeText(result)
			toast()
			return
		}
		toast('tb')
		// /* Copy the text inside the text field */
	}

	return (
		<>
			<div className="container">
				<textarea
					id="text-input"
					className="custom-scrollbar"
					autoFocus
					onChange={(e) => setInputValue(e.target.value)}
					value={inputValue}
					cols="40"
					rows="20"
				></textarea>
				<pre id="result" ref={resultRef} className="custom-scrollbar">
					{result}
				</pre>
			</div>
			<div className="bottom">
				<div className="container-wrapper">
					<div className="container-wrapper">
						{option === 'dl' ? (
							<>
								{arrDl.map((item) => (
									<input
										key={item}
										type="text"
										name={item}
										onChange={handleClassDl}
										value={objDl[item]}
										placeholder={'Class of ' + item}
									/>
								))}
							</>
						) : (
							<>
								{arrUl.map((item) => (
									<input
										key={item}
										type="text"
										name={item}
										value={objUl[item]}
										onChange={handleClassUl}
										placeholder={'Class of ' + item}
									/>
								))}
							</>
						)}
					</div>
					<div>
						<input
							type="radio"
							id="dl"
							name="option"
							defaultChecked={option === 'dl'}
							onChange={handleChangeOption}
						/>
						<label htmlFor="dl">
							<span>dl</span>
						</label>
					</div>
					<div>
						<input
							type="radio"
							id="ul"
							name="option"
							defaultChecked={option === 'ul'}
							onChange={handleChangeOption}
						/>
						<label htmlFor="ul">
							<span>ul</span>
						</label>
					</div>
					<button onClick={handleCopy}>Copy</button>
				</div>
				<div className="container-wrapper">
					<button
						onClick={() => {
							setObjDl({ dl: '', dd: '', dt: '' })
							setObjUl({ ul: '', li: '' })
						}}
					>
						Remove All Class
					</button>
					<button onClick={() => setInputValue('')}>Clear</button>
				</div>
			</div>
		</>
	)
}

export default App
