import React, { useEffect, useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useModel } from 'umi';

interface CourseSelectProps {
	value?: string | number;
	onChange?: (val: string | number) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large';
	status?: 'approved' | 'pending' | 'rejected';
	defaultFirst?: boolean;
}

const CourseSelect: React.FC<CourseSelectProps> = ({
	value,
	onChange,
	placeholder = 'Chọn khóa học',
	disabled = false,
	allowClear = true,
	style = { width: '100%' },
	size = 'middle',
	status,
	defaultFirst = false,
}) => {
	const { danhSach, getAllModel } = useModel('course.courses');
	const [loading, setLoading] = useState(false);

	// Lấy danh sách khóa học
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setLoading(true);
				const res = await getAllModel();
				if (defaultFirst && onChange && res?.length > 0 && !value) {
					onChange(res[0].id);
				}
			} catch (error) {
				message.error('Không thể tải danh sách khóa học');
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [getAllModel, onChange, defaultFirst, value]);

	// Lọc khóa học theo trạng thái
	const filteredCourses = useMemo(() => {
		if (!status) return danhSach;
		return danhSach.filter((course: any) => course.status === status);
	}, [danhSach, status]);

	// Tạo options cho Select
	const options = useMemo(() => {
		return filteredCourses.map((course: any) => ({
			value: course.id,
			label: `${course.title} - ${course.instructor}`,
		}));
	}, [filteredCourses]);

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

export default CourseSelect;
