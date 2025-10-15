import React from 'react';
import { Plus } from 'lucide-react';

export const ColumnHeader = ({ label, count, showAdd, onAdd }) => (
	<div className="column-header">
		<div className="column-header-left">
			<h3 className="column-title">{label}</h3>
		</div>

		<div className="column-header-center">
			{showAdd ? <span className="column-count">{count}</span> : null}
		</div>

		<div className="column-header-right">
			{!showAdd && <span className="column-count">{count}</span>}
			{showAdd && (
				<button className="column-add-inline with-label" onClick={onAdd} aria-label="Thêm thẻ">
					<Plus className="column-add-icon" />
					<span className="column-add-text">Thêm</span>
				</button>
			)}
		</div>
	</div>
);
