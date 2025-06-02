import React, { useEffect, useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useModel } from 'umi';

interface CategorySelectProps {
	value?: string | number;
	onChange?: (val: string | number) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large';
	parentOnly?: boolean;
	defaultFirst?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
	value,
	onChange,
	placeholder = 'Chọn danh mục',
	disabled = false,
	allowClear = true,
	style = { width: '100%' },
	size = 'middle',
	parentOnly = false,
	defaultFirst = false,
}) => {
	const { danhSach, getAllModel } = useModel('category');
	const [loading, setLoading] = useState(false);

	// Lấy danh sách danh mục
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const res = await getAllModel();
				if (defaultFirst && onChange && res?.length > 0 && !value) {
					onChange(res[0].id);
				}
			} catch (error) {
				message.error('Không thể tải danh sách danh mục');
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, [getAllModel, onChange, defaultFirst, value]);

	// Lọc danh mục theo điều kiện
	const filteredCategories = useMemo(() => {
		if (!parentOnly) return danhSach;
		// Chỉ lấy danh mục cha (không có parent_category_id)
		return danhSach.filter((category: Category.IRecord) => !category.parent_category_id);
	}, [danhSach, parentOnly]);

	// Tạo options cho Select
	const options = useMemo(() => {
		return filteredCategories.map((category: Category.IRecord) => ({
			value: category.id,
			label: category.name,
		}));
	}, [filteredCategories]);

	return (
		<Select
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder}
			style={style}
			size={size}
			disabled={disabled}
			allowClear={allowClear}
			loading={loading}
			filterOption={(input, option) => (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ?? false}
		/>
	);
};

export default CategorySelect;
