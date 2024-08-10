export const MyButton =(props)=> {

const {title, color, backgroundColor, height, fontSize, borderRadius, borderColor, onClick} = props

    return (
        <button style={{color,
                backgroundColor,
                height,
                fontSize,
                borderRadius,
                borderColor}}
                onClick={onClick}
                >{title}</button>
    )
}