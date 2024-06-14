
CREATE TRIGGER insert_project
AFTER INSERT ON Project
BEGIN
    INSERT INTO Task (name, deadline, projectId, nodeId, rootNode, parentId) VALUES(NEW.name, NEW.deadline, NEW.id, 1, true, null);
END;