import React, { useEffect, useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useModel } from 'umi';

interface CourseSectionProps {
	value?: string | number;
	onChange?: (val: string | number) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large';
	courseId?: string | number; // Filter chapters by course
	defaultFirst?: boolean;
}

const CourseSection: React.FC<CourseSectionProps> = ({
	value,
	onChange,
	placeholder = 'Chọn chương học',
	disabled = false,
	allowClear = true,
	style = { width: '100%' },
	size = 'middle',
	courseId,
	defaultFirst = false,
}) => {
	const { danhSach, getAllModel } = useModel('course.courseSection');
	const [loading, setLoading] = useState(false);

	// Lấy danh sách chương học
	useEffect(() => {
		const fetchChapters = async () => {
			try {
				setLoading(true);
				const res = await getAllModel();
				if (defaultFirst && onChange && res?.length > 0 && !value) {
					const filteredChapters = courseId
						? res.filter((chapter: CourseSection.IRecord) => String(chapter.course_id) === String(courseId))
						: res;
					if (filteredChapters.length > 0) {
						onChange(filteredChapters[0].id);
					}
				}
			} catch (error) {
				message.error('Không thể tải danh sách chương học');
			} finally {
				setLoading(false);
			}
		};

		fetchChapters();
	}, [getAllModel, onChange, defaultFirst, value, courseId]);

	// Lọc chương học theo khóa học
	const filteredChapters = useMemo(() => {
		if (!courseId) return danhSach;
		return danhSach.filter((chapter: CourseSection.IRecord) => String(chapter.course_id) === String(courseId));
	}, [danhSach, courseId]);

	// Sắp xếp theo thứ tự
	const sortedChapters = useMemo(() => {
		return [...filteredChapters].sort(
			(a: CourseSection.IRecord, b: CourseSection.IRecord) => a.order_number - b.order_number,
		);
	}, [filteredChapters]);

	// Tạo options cho Select
	const options = useMemo(() => {
		return sortedChapters.map((chapter: CourseSection.IRecord) => ({
			value: chapter.id,
			label: `${chapter.order_number}. ${chapter.title}`,
		}));
	}, [sortedChapters]);

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

export default CourseSection;
