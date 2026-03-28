import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface MultipleSelectProps {
    value: SelectOption[];
    onChange: (value: SelectOption[]) => void;
    options: SelectOption[];
}

function listenForOutsideClicks(
    listening: boolean,
    setListening: React.Dispatch<React.SetStateAction<boolean>>,
    menuRef: React.RefObject<HTMLDivElement>,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    return () => {
        if (listening) return;
        if (!menuRef.current) return;
        setListening(true);
        [`click`, `touchstart`].forEach(type => {
            document.addEventListener(type, (evt: Event) => {
                const cur = menuRef.current;
                const node = evt.target as Node;
                if (cur && cur.contains(node)) return;
                setIsOpen(false);
            });
        });
    };
}

export function Select({ value, onChange, options }: MultipleSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const [isCheckAll, setIsCheckAll] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const [listening, setListening] = useState(false);

    function clearOptions() {
        onChange([]);
        setIsCheckAll(false);
    }

    function selectOption(option: SelectOption) {
        if (value.includes(option)) {
            onChange(value.filter(o => o !== option));
            setIsCheckAll(false);
        } else {
            let allArray = options;
            let newArray = [...value, option];
            onChange(newArray);
            if (allArray.length === newArray.length) {
                setIsCheckAll(true);
            } else {
                setIsCheckAll(false);
            }
        }
    }

    function isOptionSelected(option: SelectOption) {
        return value.includes(option);
    }

    function handleSelectAll(e: ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        setIsCheckAll(!isCheckAll);
        setIsOpen(true);
        onChange(options);
        if (isCheckAll) {
            onChange([]);
        }
    }

    useEffect(
        listenForOutsideClicks(listening, setListening, containerRef, setIsOpen)
    );

    useEffect(() => {
        if (isOpen) setHighlightedIndex(-1);
    }, [isOpen]);

    return (
        <>
            <div
                onClick={() => setIsOpen(prev => !prev)}
                tabIndex={0}
                className="container"
                ref={containerRef}
            >
                <span className="value">
                    {value.map(v => (
                        <button
                            key={v.value}
                            onClick={e => {
                                e.stopPropagation();
                                selectOption(v);
                            }}
                            className="option-badge"
                        >
                            {v.label}
                            <span className="remove-btn">&times;</span>
                        </button>
                    ))}
                </span>
                <button
                    onClick={e => {
                        e.stopPropagation();
                        clearOptions();
                        setIsOpen(false);
                    }}
                    className="clear-btn"
                >
                    &times;
                </button>
                <div className="divider"></div>
                <div className="caret"></div>
                <ul className={clsx('options', { ['show']: isOpen })}>
                    {options.map((option, index, arr) => (
                        <li
                            onClick={e => {
                                e.stopPropagation();
                                setIsOpen(false);
                                selectOption(option);
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            key={option.value}
                            className={clsx(
                                'option',
                                { ['selected']: isOptionSelected(option) },
                                { ['highlighted']: index === highlightedIndex }
                            )}
                        >
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={isOptionSelected(option)}
                                    onChange={e => {
                                        e.stopPropagation();
                                        setIsOpen(true);
                                        selectOption(option);
                                    }}
                                    className="checkbox"
                                />
                                <p className="checkbox-text">{option.label}</p>
                            </label>
                        </li>
                    ))}
                    <li
                        onClick={e => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                        className={clsx('option')}
                    >
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox"
                                checked={isCheckAll}
                                onChange={e => handleSelectAll(e)}
                            />
                            <p className="checkbox-text">Select All</p>
                        </label>
                    </li>
                </ul>
            </div>
        </>
    );
}
