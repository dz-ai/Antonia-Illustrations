type Props = {
    image: boolean;
    rows: number;
}

export function LoadingTextPlaceHolder({image, rows}: Props) {
    return (
        <div className="loading-page-placeholder">
            {
                image &&
                <section style={rows === 0 ? {borderRadius: '5px'} : {}} className="image-text-section">
                    <div className="text-section">
                        {Array.from({length: 4}).map((v, i) => <div key={i} className="text"/>)}
                    </div>
                    <div className="image-section">
                        <div className="image"></div>
                    </div>
                </section>
            }
            <section style={!image ? {borderRadius: '5px'} : {}} className="only-text-section">
                {Array.from({length: rows}).map((v, i) => <div key={i} className="text"/>)}
            </section>
        </div>
    );
}