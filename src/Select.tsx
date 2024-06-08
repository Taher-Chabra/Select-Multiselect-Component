import { useEffect, useRef, useState } from "react"
import styles from "./css/select.module.css"

export type SelectOption = {
   label: string
   value: string | number
}

type MultipleSelectProps = {
   multiple: true
   value: SelectOption[]
   onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
   multiple?: false
   value?: SelectOption 
   onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
   options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({multiple, value, onChange, options}: SelectProps) {
   const [isOpen, setIsOpen] = useState<boolean>(false)
   const [highlightedIndex, setHighlightedIndex] = useState(0)
   const containerRef = useRef<HTMLDivElement>(null)

   function clearOptions() {
      multiple? onChange([]) : onChange(undefined)
   }

   function selectOptions(option: SelectOption) {
      if (multiple) {
         if (value.includes(option)) {
            onChange(value.filter(val => val !== option))
         } else {
            onChange([...value, option])
         }
      } else {
         if (option !== value) onChange(option)
      }
   }

   function isOptionSelected(option: SelectOption) {
      return multiple? value.includes(option) : option === value
   }

   useEffect(() => {
      if (isOpen) setHighlightedIndex(0)
   }, [isOpen])

   useEffect( () => {
      const handler = (e: KeyboardEvent) => {
         if (e.target != containerRef.current) return
         switch (e.code) {
            case "Enter":
            case "Space":
               setIsOpen(prev => !prev)
               if (isOpen) selectOptions(options[highlightedIndex])
               break
            case "ArrowDown":
            case "ArrowUp": {
               if (!isOpen) {
                  setIsOpen(true)
                  break
               }
               const newValue = highlightedIndex + (e.code === "ArrowDown"? 1 : -1)
               if (newValue >= 0 && newValue < options.length) {
               setHighlightedIndex(newValue)
               }
               break
            }
            case "Escape": 
               setIsOpen(false)
               break
         }
      }
                    
      containerRef.current?.addEventListener("keydown", handler)

      return () => (
         containerRef.current?.removeEventListener("keydown", handler)
      )
   },[isOpen, highlightedIndex, options])

  return ( 
      <div 
      ref = {containerRef}
      onBlur={() => setIsOpen(false)}
      tabIndex={0} 
      onClick={() => setIsOpen(prev => !prev)} 
      className={styles.container}
      >
         <span className={styles.value}>
            {multiple ? value.map(val => (
               <button 
               key={val.value} 
               onClick={e => {
                  e.stopPropagation()
                  selectOptions(val)
               }} 
               className={styles["option-badge"]}
               >
                  {val.label}
                  <span className={styles["remove-btn"]}>
                     &times;
                  </span>
               </button>
            )) : value?.label}
         </span>
         <button 
         className={styles["clear-btn"]}
         onClick={e => {
            e.stopPropagation()
            clearOptions()
         }}
         >
            &times;
         </button>
         <div className={styles.divider}></div>
         <div className={styles.caret}></div>
         <ul className={`${styles.options} ${isOpen? styles.show : ""}`}>
         {options.map((option, index) => (
            <li 
            key={option.value} 
            onMouseEnter={() => setHighlightedIndex(index)}
            onClick={e => {
               e.stopPropagation()
               selectOptions(option)
               setIsOpen(false)
            }}
            className={`${styles.option} 
               ${isOptionSelected(option) ? styles.selected : ""} 
               ${index === highlightedIndex ? styles.highlighted : ""}`
            }
            >
               {option.label}
            </li>
         ))}
         </ul>
      </div>
  )
}
