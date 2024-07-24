export const MyButton =(props)=> {

const {title, color, backgroundColor, height, fontSize, borderRadius, borderColor} = props

    return (
        <button style={{color, backgroundColor, height, fontSize, borderRadius, borderColor}}>{title}</button>
    )
}